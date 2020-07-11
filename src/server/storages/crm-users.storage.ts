import { BaseStorage } from './utils/base.storage';
import { TCRMDataBaseUser } from '../models/data-base-models';
import { ItemTypes } from './utils/items.enum';
import { MainDataBaseController } from '../controllers/storage-controllers';

export class CRMUsersStorage extends BaseStorage<TCRMDataBaseUser> {
  public constructor(mainDatabaseController: MainDataBaseController) {
    super(mainDatabaseController, ItemTypes.CRM_USER);
  }
}
