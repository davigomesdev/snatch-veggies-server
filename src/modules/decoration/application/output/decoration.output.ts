import { TVector2 } from '@core/types/vector2.type';
import { DecorationEntity } from '@modules/decoration/domain/decoration.entity';

export type DecorationOutput = {
  id: string;
  index: number;
  name: string;
  price: number;
  limit: number;
  size: TVector2;
  isVisible: boolean;
  image: string;
};

export class DecorationOutputMapper {
  public static toOutput(entity: DecorationEntity): DecorationOutput {
    return entity.toManyJSON();
  }
}
