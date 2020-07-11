import { v2 } from 'cloudinary';
import { config } from './utils/cloudinary.config';
import { TStatusSucces } from '../../types';

export class ImageHostingController {
  private cloudinaryClient = v2;

  constructor() {
    this.cloudinaryClient.config(config);
  }

  public async uploadImageToHosting(filePath: string): Promise<{ id: string, url: string }> {
    const fileinfo = await this.cloudinaryClient.uploader.upload(filePath);
    const { public_id: id, secure_url: url } = fileinfo;
        
    return { id, url};
  }
    
  public async deleteImagesFromHosting(id: Array<string> | string): Promise<TStatusSucces> {
    if (Array.isArray(id)) {
      const promises = id.map(elem => this.cloudinaryClient.uploader.destroy(elem));
      await Promise.all(promises);
    } else {
      await this.cloudinaryClient.uploader.destroy(id);
    }
    
    return { status: 'ok' };
  }
}