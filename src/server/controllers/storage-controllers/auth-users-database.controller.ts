import mongoose, { Schema, Document } from 'mongoose';
import { TCRMDataBaseUser } from '../../models/data-base-models';
import { connectionString } from './utils/auth-database-url';
import { TStatusSucces } from '../../types';

export type TSafeUserData = Pick<
  TCRMDataBaseUser,
  'email' | 'firstname' | 'lastname' | 'roles' | 'id'
>;
export type TRefreshToken = string;
export type TResponseWithData<T> =
  | { status: 'ok'; user: T }
  | { status: 'not found' };

export interface IUser extends Document {
  jwt: string;
}

const UserSchema: Schema = new Schema({
  jwt: { type: String, required: true, unique: true }
});

export class AuthUsersDatabaseController {
  private static _instance: AuthUsersDatabaseController;
  private client = mongoose;
  private authUser = this.client.model<IUser>('AuthUser', UserSchema);

  public static get instance(): AuthUsersDatabaseController {
    if (!AuthUsersDatabaseController._instance) {
      AuthUsersDatabaseController._instance = new AuthUsersDatabaseController();
    }

    return AuthUsersDatabaseController._instance;
  }

  constructor() {
    this.client.Promise = global.Promise;
    const db = this.client.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error'));
    db.on('connect', console.log.bind(console, 'MongoDB connection or'));

    this.client.connect(connectionString);
  }

  public async saveAuthUser(jwt: string): Promise<TStatusSucces> {
    const response = await this.authUser.create({ jwt });

    return { status: 'ok' };
  }

  public async deleteAuthUser(jwt: string): Promise<TStatusSucces> {
    const response = await this.authUser.remove({ jwt });

    return { status: 'ok' };
  }

  public async checkIfUserAuthorised(
    jwt: string
  ): Promise<{ status: 'ok' | 'not found' }> {
    const response = await this.authUser.find({ jwt });

    return { status: response[0].jwt ? 'ok' : 'not found' };
  }
}
