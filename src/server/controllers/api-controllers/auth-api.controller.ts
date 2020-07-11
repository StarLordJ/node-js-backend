import { AuthStorage } from '../../storages';
import { Express } from 'express';
import bcrypt from 'bcrypt-nodejs';
import { jwtConfig } from './utils/jwtconfig';
import jwtTool from 'jsonwebtoken';
import {
  httpPost,
  httpReturn,
  httpBodyParam,
  httpType,
  httpGet,
  httpCookieParam
} from '../../helpers';
import { TSafeUserData } from '../storage-controllers/auth-users-database.controller';
import { TJWTResult } from '../../helpers/response-params/response-handlers/auth-cookie.handler';
import { Endpoints } from './utils/endpoints.enum';
import { TStatusSucces, TStatusError } from '../../types';

export class AuthApiController {
  public constructor(private storage: AuthStorage) {}

  public async setupMiddleware(expressApplication: Express): Promise<void> {}

  @httpGet({
    urlPattern: Endpoints.PRIVATE_AUTH,
    resultHandler: httpReturn.Json,
    bodyParams: [httpCookieParam('jwt', httpType.String)]
  })
  public async checkIsUserAuthorised({
    jwt
  }: {
    jwt: string;
  }): Promise<(TStatusSucces & { user: TSafeUserData }) | TStatusError> {
    if (jwt) {
      const response = await this.storage.checkIfUserAuthorised(jwt);
      if (response.status === 'ok') {
        const user = jwtTool.decode(jwt);
        return { status: 'ok', user: user as TSafeUserData };
      }
    }

    return { status: 'error', message: 'Авторизуйтесь!' };
  }

  @httpPost({
    urlPattern: Endpoints.PRIVATE_LOGIN,
    resultHandler: httpReturn.SetCookieJson,
    bodyParams: [
      httpBodyParam('email', httpType.String),
      httpBodyParam('password', httpType.String)
    ]
  })
  public async loginUser({
    email,
    password
  }: {
    email: string;
    password: string;
  }): Promise<TJWTResult> {
    const result = await this.storage.getUserByEmail(email);

    if (result.status === 'ok') {
      const { password: userPassword } = result.user;
      const compareResult = bcrypt.compareSync(password, userPassword);

      if (compareResult === true) {
        const token = this.makeNewJWTToken(result.user);
        this.storage.saveAuthUser(token);

        return { status: 'ok', token, user: result.user };
      }
    }

    return { status: 'error', message: 'неправильный логин/пароль' };
  }

  @httpPost({
    urlPattern: Endpoints.PRIVATE_LOGOUT,
    resultHandler: httpReturn.SetCookieJson,
    bodyParams: [httpCookieParam('jwt', httpType.String)]
  })
  public async logOut({ jwt }: { jwt: string }): Promise<TJWTResult> {
    await this.storage.deleteAuthUser(jwt);

    return { status: 'ok', token: '', user: null };
  }

  private makeNewJWTToken(user: TSafeUserData): string {
    const { email, firstname, lastname, roles, id } = user;

    return jwtTool.sign(
      { email, firstname, lastname, roles, id },
      jwtConfig.secret
    );
  }
}
