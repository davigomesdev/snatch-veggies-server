import { FishEntity } from '@modules/fish/domain/fish.entity';

export type FishOutput = {
  id: string;
  name: string;
  price: number;
  rarity: number;
  image: string;
};

export class FishOutputMapper {
  public static toOutput(entity: FishEntity): FishOutput {
    return entity.toManyJSON();
  }
}
