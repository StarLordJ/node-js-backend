import { ItemTypes } from './items.enum';
import { TStatusSucces } from '../../types';
import { QueryBuilder } from './query-builder';
import { TDataBaseModel } from './../../models/data-base-models/base.type';
import { MainDataBaseController } from '../../controllers/storage-controllers';

export abstract class BaseStorage<T extends TDataBaseModel> {
  private queryBuilder: QueryBuilder<T>;

  public constructor(protected mainDatabaseController: MainDataBaseController, itemType: ItemTypes) {
    this.queryBuilder = new QueryBuilder(itemType);
  }

  public async getItemById(id: number): Promise<T> {
    const query = this.queryBuilder.buildGetItemByIdQuery(id);
    const response = await this.mainDatabaseController.query<T>(query);

    return response[0];
  }

  public async getPublicItems(): Promise<Array<T>> {
    const query = this.queryBuilder.buildGetPublicItemsQuery();
    const response = await this.mainDatabaseController.query<T>(query);

    return response;
  }

  public async getItems(): Promise<Array<T>> {
    const query = this.queryBuilder.buildGetItemsQuery();
    const response = await this.mainDatabaseController.query<T>(query);

    return response;
  }

  public async setNewItem(item: Omit<T, 'id'>): Promise<Pick<T, 'id'>> {
    const query = this.queryBuilder.buildSetNewItemQuery(item);

    const response = await this.mainDatabaseController.query<Pick<T, 'id'>>(query);

    return response[0];
  }

  public async updateItem(
    payload: Pick<T, 'id'> & Partial<T>
  ): Promise<TStatusSucces> {
    const query = this.queryBuilder.buildUpdateItemQuery(payload);
    console.log(query)
    const response = await this.mainDatabaseController.query(query);

    return { status: 'ok' };
  }

  public async deleteItem(payload: Pick<T, 'id'>): Promise<TStatusSucces> {
    const query = this.queryBuilder.buildDeleteItemQuery(payload);
    const response = await this.mainDatabaseController.query(query);

    return { status: 'ok' };
  }

  public async changeRowsOrder(
    payload: Array<Pick<T, 'id' | 'view_order'>>
  ): Promise<TStatusSucces> {
    const query = this.queryBuilder.buildChangeRowsOrderQuery(payload);
    const response = await this.mainDatabaseController.query(query);

    return { status: 'ok' };
  }
}
