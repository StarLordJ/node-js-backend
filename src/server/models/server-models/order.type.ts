import { TDataBaseOrder } from './../data-base-models';

export type TFromServerOrder = Omit<TDataBaseOrder, 'last_changed'>;