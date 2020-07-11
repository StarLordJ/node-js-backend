import { BaseStorage } from './utils/base.storage';
import { TDataBaseReview } from '../models/data-base-models';
import { ItemTypes } from './utils/items.enum';
import { MainDataBaseController } from '../controllers/storage-controllers';

export class ReviewsStorage extends BaseStorage<TDataBaseReview> {
  public constructor(mainDatabaseController: MainDataBaseController) {
    super(mainDatabaseController, ItemTypes.REVIEW);
  }
}
