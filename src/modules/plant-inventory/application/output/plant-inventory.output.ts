import { PlantOutput } from '@modules/plant/application/output/plant.output';
import { PlantInventoryEntity } from '@modules/plant-inventory/domain/plant-inventory.entity';

export type PlantInventoryOutput = {
  id: string;
  landId: string;
  plantId: string;
  amount: number;
  inUse: number;
  harvest: number;
  plant?: PlantOutput;
};

export class PlantInventoryOutputMapper {
  public static toOutput(entity: PlantInventoryEntity): PlantInventoryOutput {
    return entity.toManyJSON();
  }
}
