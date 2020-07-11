import { BaseStorage } from './utils/base.storage';
import { TDataBaseStylist } from '../models/data-base-models';
import { ItemTypes } from './utils/items.enum';
import { MainDataBaseController } from '../controllers/storage-controllers';

export class StylistsStorage extends BaseStorage<TDataBaseStylist> {
  public constructor(mainDatabaseController: MainDataBaseController) {
    super(mainDatabaseController, ItemTypes.STYLIST);
  }
}