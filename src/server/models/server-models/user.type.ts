import { TCRMDataBaseUser } from './../data-base-models';

export type TFromServerUser = Omit<TCRMDataBaseUser, 'last_changed'>;
