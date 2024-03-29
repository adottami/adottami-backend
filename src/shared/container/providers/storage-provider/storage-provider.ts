export interface FileStorageResult {
  id: string;
  url: string;
}

export interface SaveOptions {
  uniqueFilename?: boolean;
  overwrite?: boolean;
  accessMode?: 'public';
}

interface StorageProvider {
  save(filePath: string, options?: SaveOptions): Promise<FileStorageResult>;
  remove(fileId: string): Promise<void>;
}

export default StorageProvider;
