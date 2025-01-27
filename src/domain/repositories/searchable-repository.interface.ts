import { Entity } from '@domain/entities/entity';
import { IRepository, FindParams, FindAllParams } from './repository.interface';

export type SortDirection = 'asc' | 'desc';

export type SearchProps<Filter = string> = {
  branchId?: string;
  page?: number;
  perPage?: number;
  sort?: string | null;
  sortDir?: SortDirection | null;
  filter?: Filter | null;
};

export type SearchResultProps<E extends Entity, Filter> = {
  items: E[];
  total: number;
  currentPage: number;
  perPage: number;
  sort: string | null;
  sortDir: string | null;
  filter: Filter | null;
};

export class SearchParams<Filter = string> {
  protected _branchId: string;
  protected _page: number;
  protected _perPage = 15;
  protected _sort: string | null;
  protected _sortDir: SortDirection | null;
  protected _filter: Filter | null;

  public constructor(props: SearchProps<Filter> = {}) {
    this.branchId = props.branchId;
    this.page = props.page;
    this.perPage = props.perPage;
    this.sort = props.sort;
    this.sortDir = props.sortDir;
    this.filter = props.filter;
  }

  public get branchId(): string {
    return this._branchId;
  }

  private set branchId(value: string) {
    this._branchId = value;
  }

  public get page(): number {
    return this._page;
  }

  private set page(value: number) {
    let _page = +value;
    if (Number.isNaN(_page) || _page <= 0 || parseInt(_page as any) !== _page) {
      _page = 1;
    }
    this._page = _page;
  }

  public get perPage(): number {
    return this._perPage;
  }

  private set perPage(value: number) {
    let _perPage = value === (true as any) ? this._perPage : +value;
    if (Number.isNaN(_perPage) || _perPage <= 0 || parseInt(_perPage as any) !== _perPage) {
      _perPage = this._perPage;
    }
    this._perPage = _perPage;
  }

  public get sort(): string {
    return this._sort;
  }

  private set sort(value: string | null) {
    this._sort = value === null || value === undefined || value === '' ? null : `${value}`;
  }

  public get sortDir(): string {
    return this._sortDir;
  }

  private set sortDir(value: string | null) {
    if (!this.sort) {
      this._sortDir = null;
      return;
    }
    const dir = `${value}`.toLowerCase();
    this._sortDir = dir !== 'asc' && dir !== 'desc' ? 'desc' : dir;
  }

  public get filter(): Filter | null {
    return this._filter;
  }

  private set filter(value: Filter | null) {
    this._filter =
      value === null || value === undefined || value === '' ? null : (`${value}` as any);
  }
}

export class SearchResult<E extends Entity, Filter = string> {
  public readonly items: E[];
  public readonly total: number;
  public readonly currentPage: number;
  public readonly perPage: number;
  public readonly lastPage: number;
  public readonly sort: string | null;
  public readonly sortDir: string | null;
  public readonly filter: Filter | null;

  public constructor(props: SearchResultProps<E, Filter>) {
    this.items = props.items;
    this.total = props.total;
    this.currentPage = props.currentPage;
    this.perPage = props.perPage;
    this.lastPage = Math.ceil(this.total / this.perPage);
    this.sort = props.sort ?? null;
    this.sortDir = props.sortDir ?? null;
    this.filter = props.filter ?? null;
  }

  public toJSON(forceEntity = false): {
    items: E[] | Required<any>[];
    total: number;
    currentPage: number;
    perPage: number;
    lastPage: number;
    sort: string;
    sortDir: string;
    filter: Filter;
  } {
    return {
      items: forceEntity ? this.items.map((item) => item.toManyJSON()) : this.items,
      total: this.total,
      currentPage: this.currentPage,
      perPage: this.perPage,
      lastPage: this.lastPage,
      sort: this.sort,
      sortDir: this.sortDir,
      filter: this.filter,
    };
  }
}

export interface ISearchableRepository<
  E extends Entity,
  FindInput = FindParams,
  FindAllInput = FindAllParams,
  Filter = string,
  SearchInput = SearchParams<Filter>,
  SearchOutput = SearchResult<E, Filter>,
> extends IRepository<E, FindInput, FindAllInput> {
  sortableFields: string[];
  search(props: SearchInput): Promise<SearchOutput>;
}
