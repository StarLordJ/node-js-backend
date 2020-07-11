import { BaseStorage } from './utils/base.storage';
import { TDataBasePayment } from '../models/data-base-models';
import { ItemTypes } from './utils/items.enum';
import { MainDataBaseController } from '../controllers/storage-controllers';

export class PaymentsStorage extends BaseStorage<TDataBasePayment> {
  public constructor(mainDatabaseController: MainDataBaseController) {
    super(mainDatabaseController, ItemTypes.PAYMENT);
  }
}