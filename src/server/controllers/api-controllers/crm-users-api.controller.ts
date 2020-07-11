import {
  httpBodyParam,
  httpType,
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
  httpReturn
} from '../../helpers';

import { Endpoints } from './utils/endpoints.enum';
import { CRMUsersStorage } from '../../storages';
import { TStatusSucces, TRequestPayload } from '../../types';
import bcrypt from 'bcrypt-nodejs';
import { TFromServerUser } from '../../models/server-models';
import { Express } from 'express';
import { getAuthCheckHandler } from './utils/auth-check-handler';

export class CRMUsersApiController {
  public constructor(private storage: CRMUsersStorage) {}

  public async setupMiddleware(expressApplication: Express): Promise<void> {}

  @httpGet({
    urlPattern: Endpoints.PRIVATE_CRM_USERS,
    middleWares: [getAuthCheckHandler()],
    resultHandler: httpReturn.Json
  })
  public async getAllUsers(): Promise<Array<TFromServerUser>> {
    return this.storage.getItems();
  }

  @httpPost({
    urlPattern: Endpoints.PRIVATE_CRM_USERS,
    resultHandler: httpReturn.Json,
    middleWares: [getAuthCheckHandler()],
    bodyParams: [httpBodyParam('payload', httpType.Object), httpBodyParam('user', httpType.Object)]
  })
  public async setNewUser({
    payload, user
  }: TRequestPayload<TFromServerUser>): Promise<
    Pick<TFromServerUser, 'id'>
  > {
    const password = bcrypt.hashSync(payload.password);

    return this.storage.setNewItem({ ...payload, password, last_changed: user.id });
  }

  @httpPut({
    urlPattern: Endpoints.PRIVATE_CRM_USERS,
    resultHandler: httpReturn.Json,
    middleWares: [getAuthCheckHandler()],
    bodyParams: [httpBodyParam('payload', httpType.Object),  httpBodyParam('user', httpType.Object)]
  })
  public async updateUser({
    payload, user
  }: TRequestPayload<
    Pick<TFromServerUser, 'id'> & Partial<TFromServerUser>
  >): Promise<TStatusSucces> {
    const pload = { ...payload, password: payload['password'] ? bcrypt.hashSync(payload.password) : void 0, last_changed: user.id };

    return this.storage.updateItem(pload);
  }

  @httpDelete({
    urlPattern: Endpoints.PRIVATE_CRM_USERS,
    resultHandler: httpReturn.Json,
    middleWares: [getAuthCheckHandler()],
    bodyParams: [httpBodyParam('payload', httpType.Object)]
  })
  public async deleteUser({
    payload
  }: TRequestPayload<Pick<TFromServerUser, 'id'>>): Promise<TStatusSucces> {
    return this.storage.deleteItem(payload);
  }
}
