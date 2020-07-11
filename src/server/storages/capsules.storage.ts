import { TDataBaseCapsule } from '../models/data-base-models';
import { ItemTypes } from './utils/items.enum';
import { BaseStorage } from './utils/base.storage';
import { MainDataBaseController } from '../controllers/storage-controllers';

export class CapsulesStorage extends BaseStorage<TDataBaseCapsule> {
  public constructor(mainDatabaseController: MainDataBaseController) {
    super(mainDatabaseController, ItemTypes.CAPSULE);
  }
}
