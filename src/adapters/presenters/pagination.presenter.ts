import { Transform } from 'class-transformer';

export type PaginationPresenterProps = {
  currentPage: number;
  perPage: number;
  lastPage: number;
  total: number;
};

export class PaginationPresenter {
  @Transform(({ value }) => parseInt(value))
  public currentPage: number;

  @Transform(({ value }) => parseInt(value))
  public perPage: number;

  @Transform(({ value }) => parseInt(value))
  public lastPage: number;

  @Transform(({ value }) => parseInt(value))
  public total: number;

  public constructor(props: PaginationPresenterProps) {
    this.currentPage = props.currentPage;
    this.perPage = props.perPage;
    this.lastPage = props.lastPage;
    this.total = props.total;
  }
}
