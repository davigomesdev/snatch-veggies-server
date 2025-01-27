import { ChildrenTypeEnum } from '../enums/children-type.enum';

export type TChildrenSetter = {
  id: number;
  type: ChildrenTypeEnum;
  updateAt?: Date;
};

export type TBlockSetter = {
  id: number;
  occupied: boolean;
  children: TChildrenSetter | null;
};
