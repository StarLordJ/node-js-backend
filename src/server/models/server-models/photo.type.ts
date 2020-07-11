import { TDataBasePhoto } from '../data-base-models';

export type TFromServerPhoto = Pick<TDataBasePhoto, 'id' | 'url'>;
