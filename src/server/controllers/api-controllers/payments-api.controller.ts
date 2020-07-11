import { PaymentsStorage } from "../../storages";
import { TFromServerPayment } from "../../models/server-models";
import { Express } from 'express';
import { httpGet, httpReturn, httpPost, httpBodyParam, httpType, httpPut, httpDelete } from "../../helpers";
import { Endpoints } from "./utils/endpoints.enum";
import { TRequestPayload, TStatusSucces } from "../../types";
import { getAuthCheckHandler } from "./utils/auth-check-handler";

export class PaymentsApiController {
    public constructor(private storage: PaymentsStorage) {}

  public async setupMiddleware(expressApplication: Express): Promise<void> {}

  @httpGet({
    urlPattern: Endpoints.PRIVATE_PAYMENTS,
    middleWares: [getAuthCheckHandler()],
    resultHandler: httpReturn.Json
  })
  public async getAllPayments(): Promise<Array<TFromServerPayment>> {
    return this.storage.getItems();
  }

  @httpPost({
    urlPattern: Endpoints.PRIVATE_PAYMENTS,
    resultHandler: httpReturn.Json,
    middleWares: [getAuthCheckHandler()],
    bodyParams: [httpBodyParam('payload', httpType.Object), httpBodyParam('user', httpType.Object)]
  })
  public async setNewPayment({
    payload: payment, user
  }: TRequestPayload<Omit<TFromServerPayment, 'id'>>): Promise<
    Pick<TFromServerPayment, 'id'>
  > {

    return this.storage.setNewItem({ ...payment, last_changed: user.id });
  }

  @httpPut({
    urlPattern: Endpoints.PRIVATE_PAYMENTS,
    resultHandler: httpReturn.Json,
    middleWares: [getAuthCheckHandler()],
    bodyParams: [httpBodyParam('payload', httpType.Object), httpBodyParam('user', httpType.Object)]
  })
  public async updatePayment({
    payload, user
  }: TRequestPayload<
    Pick<TFromServerPayment, 'id'> & Partial<TFromServerPayment>
  >): Promise<TStatusSucces> {
    return this.storage.updateItem({ ...payload, last_changed: user.id });
  }

  @httpDelete({
    urlPattern: Endpoints.PRIVATE_PAYMENTS,
    resultHandler: httpReturn.Json,
    middleWares: [getAuthCheckHandler()],
    bodyParams: [httpBodyParam('payload', httpType.Object)]
  })
  public async deletePayment({
    payload
  }: TRequestPayload<Pick<TFromServerPayment, 'id'>>): Promise<TStatusSucces> {

    return this.storage.deleteItem(payload);
  }    
}