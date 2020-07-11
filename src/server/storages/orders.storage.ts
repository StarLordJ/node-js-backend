import { BaseStorage } from './utils/base.storage';
import { TDataBaseOrder } from '../models/data-base-models';
import { ItemTypes } from './utils/items.enum';
import { MainDataBaseController } from '../controllers/storage-controllers';

export class OrdersStorage extends BaseStorage<TDataBaseOrder> {
  public constructor(mainDatabaseController: MainDataBaseController) {
    super(mainDatabaseController, ItemTypes.ORDER);
  }
}