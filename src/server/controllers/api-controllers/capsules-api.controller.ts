import {
  httpBodyParam,
  httpType,
  httpReturn,
  httpDelete,
  httpGet,
  httpPost,
  httpPut
} from '../../helpers';
import { Endpoints } from './utils/endpoints.enum';
import { CapsulesStorage, ImagesStorage } from '../../storages';
import { TStatusSucces, TRequestPayload } from '../../types';
import { getAuthCheckHandler } from './utils/auth-check-handler';
import { TFromServerCapsule } from '../../models/server-models';
import { TLandingCapsule } from '../../models/landing-models';
import { Express } from 'express';

export class CapsulesApiController {
  private cache: Array<TLandingCapsule> = [];

  public constructor(
    private storage: CapsulesStorage,
    private imagesStorage: ImagesStorage
  ) {}

  public async setupMiddleware(expressApplication: Express): Promise<void> {}

  @httpGet({
    urlPattern: Endpoints.PUBLIC_CAPSULES,
    resultHandler: httpReturn.Json
  })
  public async getLandingCapsules(): Promise<Array<TLandingCapsule>> {
    if (this.cache.length === 0) {
      const capsulesFromDB = await this.storage.getPublicItems();
      const imagePromises = capsulesFromDB.map(({ capsule_photos }) =>
        this.imagesStorage.getPhotoUrlById(capsule_photos)
      );
      const images = await Promise.all(imagePromises);
      this.cache = capsulesFromDB.map(
        ({ view_order, capsule_name, capsule_stylist }, index) => ({
          view_order,
          capsule_name,
          capsule_stylist,
          capsule_photos: images[index]
        })
      );
    }

    return this.cache;
  }

  @httpGet({
    urlPattern: Endpoints.PRIVATE_CAPSULES,
    middleWares: [getAuthCheckHandler()],
    resultHandler: httpReturn.Json
  })
  public async getAllCapsules(): Promise<Array<TFromServerCapsule>> {
    const capsulesFromDB = await this.storage.getItems();
    const imagePromises = capsulesFromDB.map(({ capsule_photos }) =>
      this.imagesStorage.getPhotoUrlById(capsule_photos)
    );
    const images = await Promise.all(imagePromises);

    return capsulesFromDB.map((capsuleFromDB, index) => ({
      ...capsuleFromDB,
      capsule_photos: images[index]
    }));
  }

  @httpPost({
    urlPattern: Endpoints.PRIVATE_CAPSULES,
    resultHandler: httpReturn.Json,
    middleWares: [getAuthCheckHandler()],
    bodyParams: [httpBodyParam('payload', httpType.Object), httpBodyParam('user', httpType.Object)]
  })
  public async setNewCapsule({
    payload: capsule,
    user
  }: TRequestPayload<Omit<TFromServerCapsule, 'id'>>): Promise<
    Pick<TFromServerCapsule, 'id'>
  > {
    this.resetCache();

    const capsulePhotos = capsule.capsule_photos.map(({ id }) => id);

    const capsuleForStorage = {
      ...capsule,
      capsule_photos: capsulePhotos,
      last_changed: user.id
    };

    await this.imagesStorage.makeImagesPermanent(capsulePhotos);

    return this.storage.setNewItem(capsuleForStorage);
  }

  @httpPut({
    urlPattern: Endpoints.PRIVATE_CAPSULES,
    resultHandler: httpReturn.Json,
    middleWares: [getAuthCheckHandler()],
    bodyParams: [httpBodyParam('payload', httpType.Object), httpBodyParam('user', httpType.Object)]
  })
  public async updateCapsule({
    payload, user
  }: TRequestPayload<
    Pick<TFromServerCapsule, 'id'> & Partial<TFromServerCapsule>
  >): Promise<TStatusSucces> {
    this.resetCache();

    const capsulePhotoIds = payload['capsule_photos'] && payload.capsule_photos.map(({ id }) => id) || void 0;
    const payloadForStorage = { ...payload, capsule_photos: capsulePhotoIds, last_changed: user.id };

    capsulePhotoIds && (await this.imagesStorage.makeImagesPermanent(capsulePhotoIds));

    return this.storage.updateItem(payloadForStorage);
  }

  @httpDelete({
    urlPattern: Endpoints.PRIVATE_CAPSULES,
    resultHandler: httpReturn.Json,
    middleWares: [getAuthCheckHandler()],
    bodyParams: [httpBodyParam('payload', httpType.Object)]
  })
  public async deleteCapsule({
    payload
  }: TRequestPayload<Pick<TFromServerCapsule, 'id'>>): Promise<TStatusSucces> {
    this.resetCache();

    const capsuleFromDB = await this.storage.getItemById(payload.id);
    await this.imagesStorage.deleteImages(capsuleFromDB.capsule_photos);

    return this.storage.deleteItem(payload);
  }

  @httpPost({
    urlPattern: `${Endpoints.PRIVATE_CAPSULES}/order`,
    resultHandler: httpReturn.Json,
    middleWares: [getAuthCheckHandler()],
    bodyParams: [httpBodyParam('payload', httpType.Array)]
  })
  public async changeRowsOrder({
    payload
  }: TRequestPayload<
    Array<Pick<TFromServerCapsule, 'id' | 'view_order'>>
  >): Promise<TStatusSucces> {
    this.resetCache();
    return await this.storage.changeRowsOrder(payload);
  }

  private resetCache(): void {
    this.cache = [];
  }
}
