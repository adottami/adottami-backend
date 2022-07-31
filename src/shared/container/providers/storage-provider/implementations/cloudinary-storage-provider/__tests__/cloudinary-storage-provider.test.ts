import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';

import { CloudinaryConfig } from '@/config/global-config/types';

import { SaveOptions } from '../../../storage-provider';
import CloudinaryStorageProvider from '../cloudinary-storage-provider';

jest.mock('cloudinary');
const cloudinaryMock = jest.mocked(cloudinary);

describe('Cloudinary storage provider', () => {
  const cloudinaryConfig: CloudinaryConfig = {
    cloudName: 'cloud-name',
    apiKey: 'api-key',
    apiSecret: 'api-secret',
  };

  it('should initialize correctly', () => {
    cloudinaryMock.config.mockClear();

    new CloudinaryStorageProvider(cloudinaryConfig);

    expect(cloudinaryMock.config).toHaveBeenCalledWith({
      cloud_name: cloudinaryConfig.cloudName,
      api_key: cloudinaryConfig.apiKey,
      api_secret: cloudinaryConfig.apiSecret,
      secure: true,
    });
  });

  describe('Storage lifecycle', () => {
    const fileId = 'file-1';
    const filePath = `/tmp/${fileId}`;
    const savedFileURL = `https://example.com/${fileId}`;

    describe('Save', () => {
      const cloudinaryUploadMock = jest.spyOn(cloudinaryMock.uploader, 'upload');

      beforeEach(() => {
        cloudinaryUploadMock.mockClear();

        cloudinaryUploadMock.mockResolvedValue({
          public_id: fileId,
          secure_url: savedFileURL,
        } as UploadApiResponse);
      });

      it('should support saving files to remote storage with default options', async () => {
        const cloudinaryStorage = new CloudinaryStorageProvider(cloudinaryConfig);

        const result = await cloudinaryStorage.save(filePath);

        expect(cloudinaryUploadMock).toHaveBeenCalledWith(filePath, {
          use_filename: true,
          unique_filename: true,
          overwrite: false,
          image_metadata: false,
          access_mode: 'public',
        });

        expect(result).toEqual({ id: fileId, url: savedFileURL });
      });

      it('should support saving files to remote storage with custom options', async () => {
        const cloudinaryStorage = new CloudinaryStorageProvider(cloudinaryConfig);

        const saveOptions: SaveOptions = {
          uniqueFilename: false,
          overwrite: true,
          accessMode: 'public',
        };
        const result = await cloudinaryStorage.save(filePath, saveOptions);

        expect(cloudinaryUploadMock).toHaveBeenCalledWith(filePath, {
          use_filename: true,
          unique_filename: saveOptions.uniqueFilename,
          overwrite: saveOptions.overwrite,
          image_metadata: false,
          access_mode: saveOptions.accessMode,
        });

        expect(result).toEqual({ id: fileId, url: savedFileURL });
      });
    });

    describe('Remove', () => {
      it('should support removing files from remote storage', async () => {
        const cloudinaryRemoveMock = jest.spyOn(cloudinaryMock.uploader, 'destroy').mockResolvedValue(undefined);

        const cloudinaryStorage = new CloudinaryStorageProvider(cloudinaryConfig);
        await cloudinaryStorage.remove(fileId);

        expect(cloudinaryRemoveMock).toHaveBeenCalledWith(fileId);
      });
    });
  });
});
