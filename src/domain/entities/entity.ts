import { ObjectId } from 'mongodb';
import pluralize from 'pluralize';

type AggregateChildren = Entity | Entity[];

export abstract class Entity<Props = any, ChildEntity = AggregateChildren> {
  private readonly _id: ObjectId;
  protected readonly props: Props;
  private readonly children: Map<string, ChildEntity> = new Map();

  public constructor(props: Props, id?: string | ObjectId) {
    this.props = props;
    this._id = id ? new ObjectId(id) : new ObjectId();
  }

  public get id(): string {
    return this._id.toHexString();
  }

  private getEntityKey(entity: ChildEntity): string {
    const entityKey = entity.constructor.name
      .replace(/Entity$/, '')
      .replace(/^[A-Z]/, (letter) => letter.toLowerCase());

    return Array.isArray(entity) ? pluralize(entityKey) : entityKey;
  }

  public getEntity<T extends ChildEntity>(entity?: T | string): T {
    const entityKey = typeof entity === 'string' ? entity : this.getEntityKey(entity);
    return this.children.get(entityKey) as T;
  }

  public getEntities<T extends ChildEntity>(entity?: T | string): T[] {
    const entityKey = typeof entity === 'string' ? entity : this.getEntityKey(entity);
    return this.children.get(entityKey) as T[];
  }

  public addEntity(entity: ChildEntity, key?: string): void {
    const entityKey = key || this.getEntityKey(entity);
    const existingEntities = this.children.get(entityKey);

    if (existingEntities) {
      if (Array.isArray(existingEntities)) {
        this.children.set(entityKey, [...existingEntities, entity] as ChildEntity);
      } else {
        this.children.set(entityKey, [existingEntities, entity] as ChildEntity);
      }
    } else {
      this.children.set(entityKey, entity as ChildEntity);
    }
  }

  public addEntities(...entities: ChildEntity[]): void {
    entities.forEach((entity) => this.addEntity(entity));
  }

  public toJSON(): Required<{ id: string } & Props> {
    return {
      id: this.id,
      ...this.props,
    } as Required<{ id: string } & Props>;
  }

  public toManyJSON(): Required<{ id: string } & Props & { [key: string]: any }> {
    const entitiesJson: Record<string, any> = Array.from(this.children.entries()).reduce(
      (acc, [key, entityOrEntities]) => {
        acc[key] = Array.isArray(entityOrEntities)
          ? (entityOrEntities as Entity[]).map((entity) => (entity as any).toJSON())
          : (entityOrEntities as Entity).toManyJSON();
        return acc;
      },
      {} as Record<string, any>,
    );

    return {
      id: this.id,
      ...this.props,
      ...entitiesJson,
    } as Required<{ id: string } & Props & { [key: string]: any }>;
  }
}
