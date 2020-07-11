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
import { FaqsStorage } from '../../storages';
import { TStatusSucces, TRequestPayload } from '../../types';
import { TFromServerFaq } from '../../models/server-models';
import { TLandingFaq } from '../../models/landing-models';
import { Express } from 'express';
import { getAuthCheckHandler } from './utils/auth-check-handler';

export class FaqsApiController {
  private cache: Array<TLandingFaq> = [];

  public constructor(private storage: FaqsStorage) {}

  public async setupMiddleware(expressApplication: Express): Promise<void> {}

  @httpGet({
    urlPattern: Endpoints.PUBLIC_FAQS,
    resultHandler: httpReturn.Json
  })
  public async getLandingFaqs(): Promise<Array<TLandingFaq>> {
    if (this.cache.length === 0) {
      const faqsFromDB = await this.storage.getPublicItems();

      this.cache = faqsFromDB.map(({ view_order, question, answer }) => ({
        view_order,
        question,
        answer
      }));
    }

    return this.cache;
  }

  @httpGet({
    urlPattern: Endpoints.PRIVATE_FAQS,
    middleWares: [getAuthCheckHandler()],
    resultHandler: httpReturn.Json
  })
  public async getAllFaqs(): Promise<Array<TFromServerFaq>> {
    return this.storage.getItems();
  }

  @httpPost({
    urlPattern: Endpoints.PRIVATE_FAQS,
    resultHandler: httpReturn.Json,
    middleWares: [getAuthCheckHandler()],
    bodyParams: [httpBodyParam('payload', httpType.Object), httpBodyParam('user', httpType.Object)]
  })
  public async setNewFaq({
    payload: faq, user
  }: TRequestPayload<Omit<TFromServerFaq, 'id'>>): Promise<
    Pick<TFromServerFaq, 'id'>
  > {
    this.resetCache();

    return this.storage.setNewItem({ ...faq, last_changed: user.id });
  }

  @httpPut({
    urlPattern: Endpoints.PRIVATE_FAQS,
    resultHandler: httpReturn.Json,
    middleWares: [getAuthCheckHandler()],
    bodyParams: [httpBodyParam('payload', httpType.Object), httpBodyParam('user', httpType.Object)]
  })
  public async updateFaq({
    payload, user
  }: TRequestPayload<
    Pick<TFromServerFaq, 'id'> & Partial<TFromServerFaq>
  >): Promise<TStatusSucces> {
    this.resetCache();
    return this.storage.updateItem({ ...payload, last_changed: user.id });
  }

  @httpDelete({
    urlPattern: Endpoints.PRIVATE_FAQS,
    resultHandler: httpReturn.Json,
    middleWares: [getAuthCheckHandler()],
    bodyParams: [httpBodyParam('payload', httpType.Object)]
  })
  public async deleteFaq({
    payload
  }: TRequestPayload<Pick<TFromServerFaq, 'id'>>): Promise<TStatusSucces> {
    this.resetCache();

    return this.storage.deleteItem(payload);
  }

  @httpPost({
    urlPattern: `${Endpoints.PRIVATE_FAQS}/order`,
    resultHandler: httpReturn.Json,
    middleWares: [getAuthCheckHandler()],
    bodyParams: [httpBodyParam('payload', httpType.Array)]
  })
  public async changeRowsOrder({
    payload
  }: TRequestPayload<
    Array<Pick<TFromServerFaq, 'id' | 'view_order'>>
  >): Promise<TStatusSucces> {
    this.resetCache();
    return await this.storage.changeRowsOrder(payload);
  }

  private resetCache(): void {
    this.cache = [];
  }
}
