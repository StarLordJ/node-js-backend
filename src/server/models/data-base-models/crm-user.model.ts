import { TCRMUserId } from '../../types';

export enum UserStatus {
  ACTIVE = 'active',
  DISABLED = 'disabled'
}

export enum UserRolesMatrix {
  DIRECTOR = 'Директор',
  CONTENT_MANAGER = 'Контент-менеджер',
  MANAGER = 'Менеджер',
  SYSTEM_ADMINISTRATOR = 'Системный администратор'
}

export type TCRMDataBaseUser = {
  id: TCRMUserId;
  reset_password: boolean;
  roles: Array<UserRolesMatrix>;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  status: UserStatus;
  last_changed: TCRMUserId;
};
