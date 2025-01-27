import { Exclude, Expose } from 'class-transformer';
import { PaginationPresenter } from './pagination.presenter';

export abstract class CollectionPresenter {
  @Exclude()
  protected paginationPresenter: PaginationPresenter;

  public constructor(props: PaginationPresenter) {
    this.paginationPresenter = new PaginationPresenter(props);
  }

  @Expose({ name: 'meta' })
  public get meta(): PaginationPresenter {
    return this.paginationPresenter;
  }

  public abstract get data();
}
