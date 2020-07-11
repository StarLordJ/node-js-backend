import { BaseStorage } from './utils/base.storage';
import { TDataBaseClient } from '../models/data-base-models';
import { ItemTypes } from './utils/items.enum';
import { MainDataBaseController } from '../controllers/storage-controllers';

export class ClientsStorage extends BaseStorage<TDataBaseClient> {
  public constructor(mainDatabaseController: MainDataBaseController) {
    super(mainDatabaseController, ItemTypes.CLIENT);
  }
}