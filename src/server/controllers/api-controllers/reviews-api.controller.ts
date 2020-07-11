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
import { ReviewsStorage, ImagesStorage } from '../../storages';
import { TStatusSucces, TStoragePhotoId, TRequestPayload } from '../../types';
import { TFromServerReview } from '../../models/server-models';
import { TLandingReview } from '../../models/landing-models';
import { Express } from 'express';
import { getAuthCheckHandler } from './utils/auth-check-handler';

export class ReviewsApiController {
  private cache: Array<TLandingReview> = [];

  public constructor(
    private storage: ReviewsStorage,
    private imagesStorage: ImagesStorage
  ) {}

  public async setupMiddleware(expressApplication: Express): Promise<void> {}

  @httpGet({
    urlPattern: Endpoints.PUBLIC_REVIEWS,
    resultHandler: httpReturn.Json
  })
  public async getLandingReviews(): Promise<Array<TLandingReview>> {
    if (this.cache.length === 0) {
      const dbReviews = await this.storage.getPublicItems();
      const imagePromises = dbReviews.map(({ client_photo }) =>
        this.imagesStorage.getPhotoUrlById(client_photo)
      );
      const images = await Promise.all(imagePromises);

      this.cache = dbReviews.map(
        (
          { view_order, client_age, client_job, client_name, review_text },
          index
        ) => ({
          view_order,
          client_age,
          client_job,
          client_name,
          review_text,
          client_photo: images[index][0]
        })
      );
    }

    return this.cache;
  }

  @httpGet({
    urlPattern: Endpoints.PRIVATE_REVIEWS,
    middleWares: [getAuthCheckHandler()],
    resultHandler: httpReturn.Json
  })
  public async getAllReviews(): Promise<Array<TFromServerReview>> {
    const dbReviews = await this.storage.getItems();
    const imagePromises = dbReviews.map(({ client_photo }) =>
      this.imagesStorage.getPhotoUrlById(client_photo)
    );
    const images = await Promise.all(imagePromises);

    return dbReviews.map((dbReview, index) => ({
      ...dbReview,
      client_photo: images[index][0]
    }));
  }

  @httpPost({
    urlPattern: Endpoints.PRIVATE_REVIEWS,
    resultHandler: httpReturn.Json,
    middleWares: [getAuthCheckHandler()],
    bodyParams: [httpBodyParam('payload', httpType.Object), httpBodyParam('user', httpType.Object)]
  })
  public async setNewReview({
    payload: review, user
  }: TRequestPayload<Omit<TFromServerReview, 'id'>>): Promise<
    Pick<TFromServerReview, 'id'>
  > {
    this.resetCache();

    const reviewForStorage = {
      ...review,
      client_photo: review.client_photo.id,
      last_changed: user.id
    };
    await this.imagesStorage.makeImagesPermanent(review.client_photo.id);

    return this.storage.setNewItem(reviewForStorage);
  }

  @httpPut({
    urlPattern: Endpoints.PRIVATE_REVIEWS,
    resultHandler: httpReturn.Json,
    middleWares: [getAuthCheckHandler()],
    bodyParams: [httpBodyParam('payload', httpType.Object), httpBodyParam('user', httpType.Object)]
  })
  public async updateReview({
    payload, user
  }: TRequestPayload<
    Pick<TFromServerReview, 'id'> & Partial<TFromServerReview>
  >): Promise<TStatusSucces> {
    this.resetCache();

    const payloadForStorage = { ...payload, client_photo: payload['client_photo'] ? payload.client_photo.id : void 0, last_changed: user.id };

    payload['client_photo'] &&
      (await this.imagesStorage.makeImagesPermanent(payload.client_photo.id));

    return this.storage.updateItem(payloadForStorage);
  }

  @httpDelete({
    urlPattern: Endpoints.PRIVATE_REVIEWS,
    resultHandler: httpReturn.Json,
    middleWares: [getAuthCheckHandler()],
    bodyParams: [httpBodyParam('payload', httpType.Object)]
  })
  public async deleteReview({
    payload
  }: TRequestPayload<Pick<TFromServerReview, 'id'>>): Promise<TStatusSucces> {
    this.resetCache();

    const reviewFromDB = await this.storage.getItemById(payload.id);
    await this.imagesStorage.deleteImages(reviewFromDB.client_photo);

    return this.storage.deleteItem(payload);
  }

  @httpPost({
    urlPattern: `${Endpoints.PRIVATE_REVIEWS}/order`,
    resultHandler: httpReturn.Json,
    middleWares: [getAuthCheckHandler()],
    bodyParams: [httpBodyParam('payload', httpType.Array)]
  })
  public async changeRowsOrder({
    payload
  }: TRequestPayload<
    Array<Pick<TFromServerReview, 'id' | 'view_order'>>
  >): Promise<TStatusSucces> {
    this.resetCache();
    return await this.storage.changeRowsOrder(payload);
  }

  private resetCache(): void {
    this.cache = [];
  }
}
