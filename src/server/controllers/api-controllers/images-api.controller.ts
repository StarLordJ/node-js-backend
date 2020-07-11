import {
  httpPost,
  httpReturn,
  httpBodyParam,
  httpType,
  httpDelete
} from '../../helpers';
import { getStorageConfig } from './utils/multer.config';
import path from 'path';

import { Endpoints } from './utils/endpoints.enum';
import multer from 'multer';
import { clearDirectory } from './utils/clear-directory';
import { ImagesStorage } from '../../storages';
import { TFromServerPhoto } from '../../models/server-models';
import { Express } from 'express';
import { TStoragePhotoId, TStatusSucces } from '../../types';
import { getAuthCheckHandler } from './utils/auth-check-handler';

const multerStorage = getStorageConfig(
  path.join(__dirname, '../../../uploads/reviews')
);

export class ImagesApiController {
  constructor(private storage: ImagesStorage) {
    this.initClearTempFilesDaemon();
  }

  public async setupMiddleware(expressApplication: Express): Promise<void> {}

  @httpPost({
    urlPattern: Endpoints.PRIVATE_IMAGES,
    resultHandler: httpReturn.Json,
    middleWares: [getAuthCheckHandler(), multer({ storage: multerStorage }).single('photo')],
    bodyParams: [httpBodyParam('blob', httpType.File)]
  })
  public async uploadReviewImage({
    blob: image
  }: Record<'blob', Express.Multer.File>): Promise<TFromServerPhoto> {
    return this.uploadPhotoToStorage(image);
  }

  @httpDelete({
    urlPattern: Endpoints.PRIVATE_IMAGES,
    resultHandler: httpReturn.Json,
    middleWares: [getAuthCheckHandler()],
    bodyParams: [httpBodyParam('payload', httpType.Array)]
  })
  public async deleteReviewImage({
    payload
  }: {
    payload: Array<TStoragePhotoId>;
  }): Promise<TStatusSucces> {
    return this.storage.deleteImages(payload);
  }

  private async uploadPhotoToStorage(
    image: Express.Multer.File
  ): Promise<TFromServerPhoto> {
    const photo = await this.storage.uploadImage(image);
    clearDirectory(image.path);

    return photo;
  }

  private initClearTempFilesDaemon(): void {
    setInterval(() => {
      this.storage.deleteTempImages();
    }, 604800000);
  }
}
