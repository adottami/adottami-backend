import fs from 'fs-extra';
import path from 'path';

import { TEMPORARY_FOLDER } from '@/config/global-config/constants';

export async function saveSampleImageToFileSystem() {
  const imageFileName = 'image.jpg';
  const imageFileData = 'image-data';
  const imageFilePath = path.join(TEMPORARY_FOLDER, imageFileName);

  await fs.mkdir(TEMPORARY_FOLDER, { recursive: true });
  await fs.writeFile(imageFilePath, imageFileData);
  return imageFilePath;
}
