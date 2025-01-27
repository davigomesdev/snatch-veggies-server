import { FishOutput } from '@modules/fish/application/output/fish.output';
import { FishInventoryEntity } from '@modules/fish-inventory/domain/fish-inventory.entity';

export type FishInventoryOutput = {
  id: string;
  landId: string;
  fishId: string;
  amount: number;
  fish?: FishOutput;
};

export class FishInventoryOutputMapper {
  public static toOutput(entity: FishInventoryEntity): FishInventoryOutput {
    return entity.toManyJSON();
  }
}
