import map from '../../infrastructure/data/map.json';

import { JsonFileService } from '@infrastructure/json-file/json-file.service';
import { SnatchVeggiesLandService } from '@infrastructure/ethers/services/snatch-veggies-land.service';

import { IUseCase } from '@application/usecases/use-case.interface';

import { LandEntity } from '@modules/land/domain/land.entity';
import { LandRepository } from '@modules/land/domain/land.repository';

import { UserRepository } from '@modules/user/domain/user.repository';
import { BlockRepository } from '@modules/block/domain/block.repository';
import { DecorationRepository } from '@modules/decoration/domain/decoration.repository';

import { BlockInventoryEntity } from '@modules/block-inventory/domain/block-inventory.entity';
import { BlockInventoryRepository } from '@modules/block-inventory/domain/block-inventory.repository';

import { DecorationInventoryEntity } from '@modules/decoration-inventory/domain/decoration-inventory.entity';
import { DecorationInventoryRepository } from '@modules/decoration-inventory/domain/decoration-inventory.repository';

export namespace CreateLandUseCase {
  export type Input = {
    userId: string;
  };

  export type Output = void;

  export class UseCase implements IUseCase<Input, Output> {
    public constructor(
      private readonly landRepository: LandRepository.Repository,
      private readonly userRepository: UserRepository.Repository,
      private readonly blockRepository: BlockRepository.Repository,
      private readonly decorationRepository: DecorationRepository.Repository,
      private readonly blockInventoryRepository: BlockInventoryRepository.Repository,
      private readonly decorationInventoryRepository: DecorationInventoryRepository.Repository,
      private readonly snatchVeggiesLandService: SnatchVeggiesLandService,
      private readonly jsonFileService: JsonFileService,
    ) {}

    public async execute(input: Input): Promise<Output> {
      const user = await this.userRepository.find({ id: input.userId });

      const currentLands = await this.landRepository.findAll({ userId: user.id });
      const tokens = await this.snatchVeggiesLandService.listTokenIdsByOwner(user.address);

      const existingTokenIds = new Set(currentLands.map((land) => land.tokenId));

      for (const tokenId of tokens) {
        if (existingTokenIds.has(Number(tokenId))) continue;

        const isExists = await this.landRepository.isExists(Number(tokenId));

        if (isExists) {
          const land = await this.landRepository.find({
            tokenId: Number(tokenId),
          });

          if (land.userId !== user.id) {
            land.updateUserId(user.id);
            await this.landRepository.update(land);
          }
        } else {
          const landEntity = new LandEntity({
            userId: user.id,
            tokenId: Number(tokenId),
            name: `LAND #${tokenId.toString()}`,
          });

          const airBlock = await this.blockRepository.find({ index: 0 });
          const plowedDirtBlock = await this.blockRepository.find({ index: 2 });
          const grassBlock = await this.blockRepository.find({ index: 4 });
          const grassClumpBlock = await this.blockRepository.find({ index: 5 });
          const grassBladesBlock = await this.blockRepository.find({ index: 6 });
          const grassCoverBlock = await this.blockRepository.find({ index: 7 });
          const sandBlock = await this.blockRepository.find({ index: 8 });

          const flowerDecoration = await this.decorationRepository.find({ index: 0 });
          const flowersDecoration = await this.decorationRepository.find({ index: 1 });
          const houseDecoration = await this.decorationRepository.find({ index: 3 });
          const treeDecoration = await this.decorationRepository.find({ index: 4 });
          const treeSmallDecoration = await this.decorationRepository.find({ index: 5 });

          const air = new BlockInventoryEntity({
            landId: landEntity.id,
            blockId: airBlock.id,
            amount: 3600,
            inUse: 3117,
          });

          const grass = new BlockInventoryEntity({
            landId: landEntity.id,
            blockId: grassBlock.id,
            amount: 357,
            inUse: 357,
          });

          const grassClump = new BlockInventoryEntity({
            landId: landEntity.id,
            blockId: grassClumpBlock.id,
            amount: 27,
            inUse: 27,
          });

          const grassBlades = new BlockInventoryEntity({
            landId: landEntity.id,
            blockId: grassBladesBlock.id,
            amount: 28,
            inUse: 28,
          });

          const grassCover = new BlockInventoryEntity({
            landId: landEntity.id,
            blockId: grassCoverBlock.id,
            amount: 20,
            inUse: 20,
          });

          const plowedDirt = new BlockInventoryEntity({
            landId: landEntity.id,
            blockId: plowedDirtBlock.id,
            amount: 20,
            inUse: 20,
          });

          const sand = new BlockInventoryEntity({
            landId: landEntity.id,
            blockId: sandBlock.id,
            amount: 34,
            inUse: 34,
          });

          const house = new DecorationInventoryEntity({
            landId: landEntity.id,
            decorationId: houseDecoration.id,
            amount: 1,
            inUse: 1,
          });

          const flower = new DecorationInventoryEntity({
            landId: landEntity.id,
            decorationId: flowerDecoration.id,
            amount: 7,
            inUse: 7,
          });

          const flowers = new DecorationInventoryEntity({
            landId: landEntity.id,
            decorationId: flowersDecoration.id,
            amount: 4,
            inUse: 4,
          });

          const tree = new DecorationInventoryEntity({
            landId: landEntity.id,
            decorationId: treeDecoration.id,
            amount: 8,
            inUse: 8,
          });

          const treeSmall = new DecorationInventoryEntity({
            landId: landEntity.id,
            decorationId: treeSmallDecoration.id,
            amount: 6,
            inUse: 6,
          });

          await this.landRepository.create(landEntity);

          await this.blockInventoryRepository.createMany([
            air,
            grass,
            grassClump,
            grassCover,
            grassBlades,
            plowedDirt,
            sand,
          ]);

          await this.decorationInventoryRepository.createMany([
            house,
            flower,
            flowers,
            tree,
            treeSmall,
          ]);

          this.jsonFileService.createFile(tokenId.toString(), map);
        }

        existingTokenIds.add(Number(tokenId));
      }
    }
  }
}
