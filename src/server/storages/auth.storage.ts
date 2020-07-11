import { TCRMDataBaseUser } from '../models/data-base-models';
import { TStatusSucces } from '../types';
import {
  MainDataBaseController,
  AuthUsersDatabaseController
} from '../controllers/storage-controllers';
import {
  TResponseWithData,
  TSafeUserData
} from '../controllers/storage-controllers/auth-users-database.controller';

export class AuthStorage {
  private authDatabaseController: AuthUsersDatabaseController =
    AuthUsersDatabaseController.instance;

  public constructor(private mainDatabaseController: MainDataBaseController) {}

  public async getUserByEmail(
    email: string
  ): Promise<TResponseWithData<TCRMDataBaseUser>> {
    const query = `SELECT * FROM "public"."CRM_Users" WHERE email='${email}'`;
    const result = await this.mainDatabaseController.query<TCRMDataBaseUser>(
      query
    );

    return result.length === 0
      ? { status: 'not found' }
      : { status: 'ok', user: result[0] };
  }

  public async saveAuthUser(jwt: string): Promise<TStatusSucces> {
    return this.authDatabaseController.saveAuthUser(jwt);
  }

  public async deleteAuthUser(jwt: string): Promise<TStatusSucces> {
    return this.authDatabaseController.deleteAuthUser(jwt);
  }

  public async checkIfUserAuthorised(
    jwt: string
  ): Promise<TResponseWithData<TSafeUserData>> {
    return this.authDatabaseController.checkIfUserAuthorised(jwt);
  }
}
