import { TVector2 } from '@core/types/vector2.type';
import { TBlockSetter } from '@core/types/block-setter';

import { ChildrenTypeEnum } from '@core/enums/children-type.enum';

import { WsNotFoundError } from '@domain/ws-errors/ws-not-found-error';

import { JsonFileService } from '@infrastructure/json-file/json-file.service';

import { IUseCase } from '@application/usecases/use-case.interface';

import { LandRepository } from '@modules/land/domain/land.repository';
import { DecorationRepository } from '@modules/decoration/domain/decoration.repository';
import { DecorationInventoryRepository } from '@modules/decoration-inventory/domain/decoration-inventory.repository';

export namespace DeleteDecorationBlockLandUseCase {
  export type Input = {
    id: string;
    userId: string;
    blockPos: TVector2;
  };

  export type Output = void;

  export class UseCase implements IUseCase<Input, Output> {
    public constructor(
      private readonly landRepository: LandRepository.Repository,
      private readonly decorationRepository: DecorationRepository.Repository,
      private readonly decorationInventoryRepository: DecorationInventoryRepository.Repository,
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

      if (
        blockSetter.children === null ||
        blockSetter.children.type !== ChildrenTypeEnum.DECORATION
      ) {
        throw new WsNotFoundError('Decoration not found.');
      }

      const decoration = await this.decorationRepository.find({
        index: blockSetter.children.id,
      });

      const decorationInventory = await this.decorationInventoryRepository.find({
        landId: land.id,
        decorationId: decoration.id,
      });

      decorationInventory.updateInUse(decorationInventory.inUse - 1);
      const adjacentBlocks = this.getAdjacentBlocks(blocks, blockPos, decoration.size);

      adjacentBlocks.map((block) => {
        if (block) blocks[block.y][block.x].occupied = false;
      });

      blockSetter.occupied = false;
      blockSetter.children = null;

      blocks[blockPos.y][blockPos.x] = blockSetter;

      await this.decorationInventoryRepository.update(decorationInventory);
      this.jsonFileService.updateFile(land.tokenId.toString(), blocks);
    }

    private getAdjacentBlocks(
      blocks: TBlockSetter[][],
      position: TVector2,
      size: TVector2,
    ): ((TBlockSetter & TVector2) | null)[] {
      const adjacentBlocks: ((TBlockSetter & TVector2) | null)[] = [];

      for (let dx = -Math.floor(size.x / 2); dx <= Math.floor(size.x / 2); dx++) {
        for (let dy = -Math.floor(size.y / 2); dy <= Math.floor(size.y / 2); dy++) {
          const neighborX = position.x + dx;
          const neighborY = position.y + dy;

          const block = blocks[neighborY]?.[neighborX];
          adjacentBlocks.push(block ? { ...block, x: neighborX, y: neighborY } : null);
        }
      }

      return adjacentBlocks;
    }
  }
}
