import StorageProvider, { SaveOptions, FileStorageResult } from '../storage-provider';

abstract class AbstractStorageProvider implements StorageProvider {
  abstract save(filePath: string, options?: SaveOptions): Promise<FileStorageResult>;

  async saveAll(filePaths: string[], options: SaveOptions = {}): Promise<FileStorageResult[]> {
    const savePromises = filePaths.map((filePath) => this.save(filePath, options));
    const storageResults = await Promise.all(savePromises);
    return storageResults;
  }

  abstract remove(fileId: string): Promise<void>;

  async removeAll(fileIds: string[]) {
    const removePromises = fileIds.map((fileId) => this.remove(fileId));
    await Promise.all(removePromises);
  }
}

export default AbstractStorageProvider;
