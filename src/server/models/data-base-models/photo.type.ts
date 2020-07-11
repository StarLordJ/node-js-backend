import { TStoragePhotoId, TStoragePhotoUrl } from '../../types';

export type TDataBasePhoto = {
  id: TStoragePhotoId;
  url: TStoragePhotoUrl;
  is_temp: boolean;
  created_at: Date;
};
