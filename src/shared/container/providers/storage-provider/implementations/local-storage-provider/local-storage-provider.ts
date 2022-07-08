import fs from 'fs-extra';
import path from 'path';

import StorageProvider, { FileStorageResult } from '../../storage-provider';
import { LOCAL_STORAGE_FOLDER } from './constants';

class LocalStorageProvider implements StorageProvider {
  async save(filePath: string): Promise<FileStorageResult> {
    const fileId = this.getFileId(filePath);
    const absoluteFilePath = this.getAbsoluteFilePath(fileId);

    await this.initializeLocalStorageFolder();
    await fs.rename(filePath, absoluteFilePath);

    return {
      id: fileId,
      url: absoluteFilePath,
    };
  }

  private async initializeLocalStorageFolder() {
    await fs.mkdir(LOCAL_STORAGE_FOLDER, { recursive: true });
  }

  async remove(fileId: string) {
    await fs.remove(this.getAbsoluteFilePath(fileId));
  }

  private getFileId(filePath: string) {
    return path.basename(filePath);
  }

  private getAbsoluteFilePath(fileId: string) {
    return path.join(LOCAL_STORAGE_FOLDER, fileId);
  }
}

export default LocalStorageProvider;
