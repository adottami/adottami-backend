import fs from 'fs-extra';
import path from 'path';

import { TEMPORARY_FOLDER } from '@/config/global-config/constants';

import { LOCAL_STORAGE_FOLDER } from '../constants';
import LocalStorageProvider from '../local-storage-provider';

describe('Local storage provider', () => {
  const fileId = 'file-1';
  const fileData = 'file-data';
  const filePath = path.join(TEMPORARY_FOLDER, fileId);
  const savedFilePath = path.join(LOCAL_STORAGE_FOLDER, fileId);

  beforeEach(async () => {
    await fs.writeFile(filePath, fileData);
  });

  afterAll(async () => {
    await fs.remove(savedFilePath);
  });

  it('should support saving a file to local storage', async () => {
    const localStorage = new LocalStorageProvider();

    const result = await localStorage.save(filePath);

    expect(result).toEqual({
      id: fileId,
      url: savedFilePath,
    });

    const savedFileData = await fs.readFile(savedFilePath);
    expect(savedFileData.toString()).toBe(fileData);
  });

  it('should support removing files from local storage', async () => {
    const localStorage = new LocalStorageProvider();

    await localStorage.save(filePath);
    expect(await fs.pathExists(savedFilePath)).toBe(true);

    await localStorage.remove(fileId);
    expect(await fs.pathExists(savedFilePath)).toBe(false);
  });
});
