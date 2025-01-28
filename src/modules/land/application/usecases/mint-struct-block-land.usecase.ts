import { differenceInMinutes } from 'date-fns';

import { TVector2 } from '@core/types/vector2.type';

import { BlockTypeEnum } from '@core/enums/block-type.enum';
import { ChildrenTypeEnum } from '@core/enums/children-type.enum';

import { WsBadRequestError } from '@domain/ws-errors/ws-bad-request-error';

import { JsonFileService } from '@infrastructure/json-file/json-file.service';

import { IUseCase } from '@application/usecases/use-case.interface';

import { LandRepository } from '@modules/land/domain/land.repository';
import { BlockRepository } from '@modules/block/domain/block.repository';
import { StructRepository } from '@modules/struct/domain/struct.repository';

import { StructInventoryRepository } from '@modules/struct-inventory/domain/struct-inventory.repository';
import {
  StructInventoryOutput,
  StructInventoryOutputMapper,
} from '@modules/struct-inventory/application/output/struct-inventory.output';

export namespace MintStructBlockLandUseCase {
  export type Input = {
    id: string;
    userId: string;
    blockPos: TVector2;
  };

  export type Output = StructInventoryOutput;

  export class UseCase implements IUseCase<Input, Output> {
    public constructor(
      private readonly landRepository: LandRepository.Repository,
      private readonly blockRepository: BlockRepository.Repository,
      private readonly structRepository: StructRepository.Repository,
      private readonly structInventoryRepository: StructInventoryRepository.Repository,
      private readonly jsonFileService: JsonFileService,
    ) {}

    public async execute(input: Input): Promise<Output> {
      const { id, userId, blockPos } = input;

      const land = await this.landRepository.find({
        id,
        userId,
      });

      const blocks = this.jsonFileService.getFile(land.tokenId.toString());
      const blockSetter = blocks[blockPos.y][blockPos.x];

      if (blockSetter.children === null || blockSetter.children.type !== ChildrenTypeEnum.STRUCT) {
        throw new WsBadRequestError('Invalid block.');
      }

      const block = await this.blockRepository.find({
        index: blockSetter.id,
      });

      if (block.type !== BlockTypeEnum.SOLID) {
        throw new WsBadRequestError('Invalid block.');
      }

      const struct = await this.structRepository.find({
        index: blockSetter.children.id,
      });

      const structInventoryEntity = await this.structInventoryRepository.find({
        landId: land.id,
        structId: struct.id,
      });

      const minutesElapsed = differenceInMinutes(new Date(), blockSetter.children.updateAt);

      if (minutesElapsed < struct.duration) {
        throw new WsBadRequestError(`It's not mint time yet.`);
      }

      land.updateExp(land.exp + struct.exp);
      structInventoryEntity.updateMinted(structInventoryEntity.minted + 1);

      blockSetter.children.updateAt = new Date();
      blocks[blockPos.y][blockPos.x] = blockSetter;

      this.jsonFileService.updateFile(land.tokenId.toString(), blocks);

      const structInventory = await this.structInventoryRepository.update(structInventoryEntity);
      await this.landRepository.update(land);

      return StructInventoryOutputMapper.toOutput(structInventory);
    }
  }
}
