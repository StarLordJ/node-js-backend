import { TDataBaseClient } from "../data-base-models";

export type TFromServerClient = Omit<TDataBaseClient, 'password' | 'last_changed'>;