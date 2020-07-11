import { BaseStorage } from './utils/base.storage';
import { TDataBaseFaq } from './../models/data-base-models';
import { ItemTypes } from './utils/items.enum';
import { MainDataBaseController } from '../controllers/storage-controllers';

export class FaqsStorage extends BaseStorage<TDataBaseFaq> {
  public constructor(mainDatabaseController: MainDataBaseController) {
    super(mainDatabaseController, ItemTypes.FAQ);
  }
}
