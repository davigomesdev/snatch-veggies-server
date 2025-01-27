import { PlantEntity } from '@modules/plant/domain/plant.entity';

export type PlantOutput = {
  id: string;
  index: number;
  name: string;
  price: number;
  duration: number;
  exp: number;
  isVisible: boolean;
  image: string;
};

export class PlantOutputMapper {
  public static toOutput(entity: PlantEntity): PlantOutput {
    return entity.toManyJSON();
  }
}
