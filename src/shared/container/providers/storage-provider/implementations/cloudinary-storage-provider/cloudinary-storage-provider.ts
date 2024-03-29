import { v2 as cloudinary } from 'cloudinary';
import { inject, singleton } from 'tsyringe';

import globalConfig from '@/config/global-config/global-config';
import { CloudinaryConfig } from '@/config/global-config/types';

import StorageProvider, { FileStorageResult, SaveOptions } from '../../storage-provider';

@singleton()
class CloudinaryStorageProvider implements StorageProvider {
  static readonly CLOUDINARY_CONFIG_INJECT_KEY = 'CloudinaryConfig';

  constructor(
    @inject(CloudinaryStorageProvider.CLOUDINARY_CONFIG_INJECT_KEY)
    cloudinaryConfig: CloudinaryConfig,
  ) {
    this.configureCloudinary(cloudinaryConfig);
  }

  static getGlobalCloudinaryConfig(): CloudinaryConfig {
    const cloudinaryConfig = globalConfig.cloudinary();
    if (cloudinaryConfig === null) {
      throw new Error('Could not initialize a cloudinary storage provider: cloudinary config not available.');
    }
    return cloudinaryConfig;
  }

  private configureCloudinary(cloudinaryConfig: CloudinaryConfig) {
    cloudinary.config({
      cloud_name: cloudinaryConfig.cloudName,
      api_key: cloudinaryConfig.apiKey,
      api_secret: cloudinaryConfig.apiSecret,
      secure: true,
    });
  }

  async save(filePath: string, options: SaveOptions = {}): Promise<FileStorageResult> {
    const { uniqueFilename = true, overwrite = false, accessMode = 'public' } = options;

    const result = await cloudinary.uploader.upload(filePath, {
      use_filename: true,
      unique_filename: uniqueFilename,
      overwrite,
      image_metadata: false,
      access_mode: accessMode,
    });

    return {
      id: result.public_id,
      url: result.secure_url,
    };
  }

  async remove(fileId: string) {
    await cloudinary.uploader.destroy(fileId);
  }
}

export default CloudinaryStorageProvider;
