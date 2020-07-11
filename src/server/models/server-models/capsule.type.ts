import { TFromServerPhoto } from './photo.type';
import { TDataBaseCapsule } from '../data-base-models';

export type TFromServerCapsule = Omit<TDataBaseCapsule, 'capsule_photos' | 'last_changed'> & {
  capsule_photos: Array<TFromServerPhoto>;
};
