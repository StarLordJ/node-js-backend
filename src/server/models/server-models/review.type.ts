import { TFromServerPhoto } from './photo.type';
import { TDataBaseReview } from '../data-base-models';

export type TFromServerReview = Omit<TDataBaseReview, 'client_photo' | 'last_changed'> & {
  client_photo: TFromServerPhoto;
};
