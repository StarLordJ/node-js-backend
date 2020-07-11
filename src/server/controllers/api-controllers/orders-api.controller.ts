import { OrdersStorage } from "../../storages";
import { TFromServerOrder } from "../../models/server-models";
import { Express } from 'express';
import { httpGet, httpReturn, httpPost, httpBodyParam, httpType, httpPut, httpDelete } from "../../helpers";
import { Endpoints } from "./utils/endpoints.enum";
import { TRequestPayload, TStatusSucces } from "../../types";
import { getAuthCheckHandler } from "./utils/auth-check-handler";

export class OrdersApiController {
  public constructor(private storage: OrdersStorage) {}

  public async setupMiddleware(expressApplication: Express): Promise<void> {}

  @httpGet({
    urlPattern: Endpoints.PRIVATE_ORDERS,
    middleWares: [getAuthCheckHandler()],
    resultHandler: httpReturn.Json
  })
  public async getAllOrders(): Promise<Array<TFromServerOrder>> {
    return this.storage.getItems();
  }

  @httpPost({
    urlPattern: Endpoints.PRIVATE_ORDERS,
    resultHandler: httpReturn.Json,
    middleWares: [getAuthCheckHandler()],
    bodyParams: [httpBodyParam('payload', httpType.Object), httpBodyParam('user', httpType.Object)]
  })
  public async setNewOrder({
    payload: order, user
  }: TRequestPayload<Omit<TFromServerOrder, 'id'>>): Promise<
    Pick<TFromServerOrder, 'id'>
  > {

    return this.storage.setNewItem({ ...order, last_changed: user.id });
  }

  @httpPut({
    urlPattern: Endpoints.PRIVATE_ORDERS,
    resultHandler: httpReturn.Json,
    middleWares: [getAuthCheckHandler()],
    bodyParams: [httpBodyParam('payload', httpType.Object), httpBodyParam('user', httpType.Object)]
  })
  public async updateOrder({
    payload, user
  }: TRequestPayload<
    Pick<TFromServerOrder, 'id'> & Partial<TFromServerOrder>
  >): Promise<TStatusSucces> {
    return this.storage.updateItem({ ...payload, last_changed: user.id });
  }

  @httpDelete({
    urlPattern: Endpoints.PRIVATE_ORDERS,
    resultHandler: httpReturn.Json,
    middleWares: [getAuthCheckHandler()],
    bodyParams: [httpBodyParam('payload', httpType.Object)]
  })
  public async deleteOrder({
    payload
  }: TRequestPayload<Pick<TFromServerOrder, 'id'>>): Promise<TStatusSucces> {

    return this.storage.deleteItem(payload);
  }    
}