import { TStoragePhotoId, TCRMUserId } from '../../types';

export type TDataBaseReview = {
  id: number;
  is_displaying: boolean;
  view_order: number;
  client_photo: TStoragePhotoId;
  client_name: string;
  client_age: string;
  client_job: string;
  review_text: string;
  last_changed: TCRMUserId;
};
