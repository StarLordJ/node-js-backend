import { TStoragePhotoId, TCRMUserId } from '../../types';

export type TDataBaseCapsule = {
  id: number;
  is_displaying: boolean;
  view_order: number;
  capsule_photos: Array<TStoragePhotoId>;
  capsule_name: string;
  capsule_stylist: string;
  last_changed: TCRMUserId;
};
