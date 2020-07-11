import { TSafeUserData } from './controllers/storage-controllers/auth-users-database.controller';

export type TStatusSucces = { status: 'ok' };
export type TStatusError = { status: 'error'; message: string };
export type TStoragePhotoUrl = string;
export type TStoragePhotoId = string;
export type TCRMUserId = number;

export type TRequestPayload<T> = {
  payload: T;
  user: TSafeUserData;
};
