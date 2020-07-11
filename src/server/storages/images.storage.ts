import { TDataBasePhoto } from '../models/data-base-models';
import { TStatusSucces, TStoragePhotoId } from './../types';
import { TFromServerPhoto } from '../models/server-models';
import { MainDataBaseController, ImageHostingController } from '../controllers/storage-controllers';

export class ImagesStorage {
  private imageHostingController: ImageHostingController;

  public constructor(private mainDatabaseController: MainDataBaseController) {
    this.imageHostingController = new ImageHostingController();
  }

  public async getPhotoUrlById(
    id: Array<TStoragePhotoId> | TStoragePhotoId
  ): Promise<Array<TFromServerPhoto>> {
    const query = Array.isArray(id)
      ? `SELECT c.id, c.url FROM "public"."Images" c JOIN (VALUES ${id
          .map((el, i) => `('${el}','${i + 1}')`)
          .join(',')}) AS x (id, ordering) ON c.id = x.id ORDER BY x.ordering`
      : `SELECT id, url FROM "public"."Images" WHERE id='${id}'`;

    const photos = await this.mainDatabaseController.query<TFromServerPhoto>(query);

    return photos;
  }

  public async uploadImage(
    image: Express.Multer.File
  ): Promise<TFromServerPhoto> {
    const { id, url } = await this.imageHostingController.uploadImageToHosting(image.path);

    const query = `INSERT INTO "public"."Images" (id, url) VALUES ('${id}', '${url}') RETURNING id, url`;
    const dataBaseId = await this.mainDatabaseController.query<TFromServerPhoto>(query);

    return dataBaseId[0];
  }

  public async makeImagesPermanent(
    imageId: Array<TStoragePhotoId> | TStoragePhotoId
  ): Promise<TStatusSucces> {
    const query = Array.isArray(imageId)
      ? `UPDATE "public"."Images" SET is_temp=false WHERE id IN(${imageId
          .map(el => `'${el}'`)
          .join(',')})`
      : `UPDATE "public"."Images" SET is_temp=false WHERE id='${imageId}'`;

    await this.mainDatabaseController.query(query);

    return { status: 'ok' };
  }

  public async deleteImages(
    imageId: Array<TStoragePhotoId> | TStoragePhotoId
  ): Promise<TStatusSucces> {
    const query = Array.isArray(imageId)
      ? `DELETE FROM "public"."Images" WHERE id IN(${imageId
          .map(el => `'${el}'`)
          .join(',')})`
      : `DELETE FROM "public"."Images" WHERE id='${imageId}'`;

    await this.imageHostingController.deleteImagesFromHosting(imageId);
    await this.mainDatabaseController.query(query);

    return { status: 'ok' };
  }

  public async deleteTempImages(): Promise<TStatusSucces> {
    const query = `SELECT * FROM "public"."Images" WHERE is_temp=TRUE AND created_at > now() - interval '1 week'`;
    const images = (await this.mainDatabaseController.query<TDataBasePhoto>(query)).map(
      ({ id }) => id
    );
    const queryForDeleting = `DELETE FROM "public"."Images" WHERE id IN(${images
      .map(el => `'${el}'`)
      .join(',')})`;

    await this.imageHostingController.deleteImagesFromHosting(images);
    await this.mainDatabaseController.query(queryForDeleting);

    return { status: 'ok' };
  }
}
