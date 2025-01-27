import { BlockTypeEnum } from '@core/enums/block-type.enum';
import { BlockEntity } from '@modules/block/domain/block.entity';

export type BlockOutput = {
  id: string;
  index: number;
  name: string;
  price: number;
  limit: number;
  type: BlockTypeEnum;
  isVisible: boolean;
  image: string;
};

export class BlockOutputMapper {
  public static toOutput(entity: BlockEntity): BlockOutput {
    return entity.toManyJSON();
  }
}
