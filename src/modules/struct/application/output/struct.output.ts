import { TVector2 } from '@core/types/vector2.type';
import { StructEntity } from '@modules/struct/domain/struct.entity';

export type StructOutput = {
  id: string;
  index: number;
  name: string;
  itemName: string;
  price?: number;
  profit?: number;
  limit?: number;
  exp?: number;
  duration: number;
  size?: TVector2;
  isVisible?: boolean;
  image: string;
  itemImage: string;
};

export class StructOutputMapper {
  public static toOutput(entity: StructEntity): StructOutput {
    return entity.toManyJSON();
  }
}
