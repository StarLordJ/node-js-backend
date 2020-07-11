import { StylistsStorage } from "../../storages";
import { TFromServerStylist } from "../../models/server-models";
import { Express } from 'express';
import { httpGet, httpReturn, httpPost, httpBodyParam, httpType, httpPut, httpDelete } from "../../helpers";
import { Endpoints } from "./utils/endpoints.enum";
import { TRequestPayload, TStatusSucces } from "../../types";
import { getAuthCheckHandler } from "./utils/auth-check-handler";
import { TDataBaseStylist } from "../../models/data-base-models";

export class StylistsApiController {
  public constructor(private storage: StylistsStorage) {}

  public async setupMiddleware(expressApplication: Express): Promise<void> {}

  @httpGet({
    urlPattern: Endpoints.PRIVATE_STYLISTS,
    middleWares: [getAuthCheckHandler()],
    resultHandler: httpReturn.Json
  })
  public async getAllPayments(): Promise<Array<TFromServerStylist>> {
    return this.storage.getItems();
  }

  @httpPost({
    urlPattern: Endpoints.PRIVATE_STYLISTS,
    resultHandler: httpReturn.Json,
    bodyParams: [httpBodyParam('payload', httpType.Object)]
  })
  public async setNewStylist({
    payload: stylist
  }: TRequestPayload<Omit<TDataBaseStylist, 'id'>>): Promise<
    Pick<TFromServerStylist, 'id'>
  > {

    return this.storage.setNewItem(stylist);
  }

  @httpPut({
    urlPattern: Endpoints.PRIVATE_STYLISTS,
    resultHandler: httpReturn.Json,
    middleWares: [getAuthCheckHandler()],
    bodyParams: [httpBodyParam('payload', httpType.Object), httpBodyParam('user', httpType.Object)]
  })
  public async updateStylist({
    payload, user
  }: TRequestPayload<
    Pick<TFromServerStylist, 'id'> & Partial<TFromServerStylist>
  >): Promise<TStatusSucces> {
    return this.storage.updateItem({ ...payload, last_changed: user.id });
  }

  @httpDelete({
    urlPattern: Endpoints.PRIVATE_STYLISTS,
    resultHandler: httpReturn.Json,
    middleWares: [getAuthCheckHandler()],
    bodyParams: [httpBodyParam('payload', httpType.Object)]
  })
  public async deleteStylist({
    payload
  }: TRequestPayload<Pick<TFromServerStylist, 'id'>>): Promise<TStatusSucces> {

    return this.storage.deleteItem(payload);
  }    
}