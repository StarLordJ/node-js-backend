import { ClientsStorage } from "../../storages";
import { TFromServerClient } from "../../models/server-models";
import { Express } from 'express';
import { httpGet, httpReturn, httpPost, httpBodyParam, httpType, httpPut, httpDelete } from "../../helpers";
import { Endpoints } from "./utils/endpoints.enum";
import { TRequestPayload, TStatusSucces } from "../../types";
import { getAuthCheckHandler } from "./utils/auth-check-handler";
import { TDataBaseClient } from "../../models/data-base-models";

export class ClientsApiController {
  public constructor(private storage: ClientsStorage) {}

  public async setupMiddleware(expressApplication: Express): Promise<void> {}

  @httpGet({
    urlPattern: Endpoints.PRIVATE_CLIENTS,
    middleWares: [getAuthCheckHandler()],
    resultHandler: httpReturn.Json
  })
  public async getAllClients(): Promise<Array<TFromServerClient>> {
    return this.storage.getItems();
  }

  @httpPost({
    urlPattern: Endpoints.PRIVATE_CLIENTS,
    resultHandler: httpReturn.Json,
    bodyParams: [httpBodyParam('payload', httpType.Object)]
  })
  public async setNewClient({
    payload: client
  }: TRequestPayload<Omit<TDataBaseClient, 'id'>>): Promise<
    Pick<TDataBaseClient, 'id'>
  > {

    return this.storage.setNewItem(client);
  }

  @httpPut({
    urlPattern: Endpoints.PRIVATE_CLIENTS,
    resultHandler: httpReturn.Json,
    middleWares: [getAuthCheckHandler()],
    bodyParams: [httpBodyParam('payload', httpType.Object), httpBodyParam('user', httpType.Object)]
  })
  public async updateClient({
    payload, user
  }: TRequestPayload<
    Pick<TFromServerClient, 'id'> & Partial<TFromServerClient>
  >): Promise<TStatusSucces> {
    return this.storage.updateItem({...payload, last_changed: user.id });
  }

  @httpDelete({
    urlPattern: Endpoints.PRIVATE_CLIENTS,
    resultHandler: httpReturn.Json,
    middleWares: [getAuthCheckHandler()],
    bodyParams: [httpBodyParam('payload', httpType.Object)]
  })
  public async deleteClient({
    payload
  }: TRequestPayload<Pick<TFromServerClient, 'id'>>): Promise<TStatusSucces> {

    return this.storage.deleteItem(payload);
  }    
}