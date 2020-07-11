import multer from 'multer';
import fs from 'fs';

export function getStorageConfig(path: string) {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
      }
      cb(null, path);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + file.originalname);
    }
  });
}
