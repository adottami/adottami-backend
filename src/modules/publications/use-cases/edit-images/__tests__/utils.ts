import fs from 'fs-extra';
import path from 'path';

import { TEMPORARY_FOLDER } from '@/config/global-config/constants';

export async function saveImageToFileSystem(imageId: string, imageFileData = 'image-data'): Promise<string> {
  const imageFileName = `image-${imageId}.jpg`;
  const imageFilePath = path.join(TEMPORARY_FOLDER, imageFileName);

  await fs.mkdir(TEMPORARY_FOLDER, { recursive: true });
  await fs.writeFile(imageFilePath, imageFileData);
  return imageFilePath;
}
