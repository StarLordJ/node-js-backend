import fs from 'fs';

export function clearDirectory(path: string): void {
  fs.unlinkSync(path);
}
