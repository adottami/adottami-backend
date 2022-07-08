import dotenv from 'dotenv';
import path from 'path';

import { PROJECT_ROOT_DIRECTORY } from './constants';
import { CloudinaryConfig, Mode } from './types';

export class GlobalConfig {
  private _mode: Mode;
  private _port: number;
  private _allowedCORSOrigins: string[];
  private _cloudinary: CloudinaryConfig | null;

  constructor() {
    this._mode = process.env.NODE_ENV ?? 'development';

    this.loadEnvironmentVariables(this.mode());

    this._port = Number(process.env.PORT);
    this._allowedCORSOrigins = process.env.ALLOWED_CORS_ORIGINS?.split(',') ?? ['*'];
    this._cloudinary = this.readCloudinaryConfig();
  }

  mode(): Mode {
    return this._mode;
  }

  port(): number {
    return this._port;
  }

  allowedCORSOrigins(): string[] {
    return this._allowedCORSOrigins;
  }

  cloudinary(): CloudinaryConfig | null {
    return this._cloudinary;
  }

  private loadEnvironmentVariables(mode: Mode) {
    const environmentFiles = [
      path.join(PROJECT_ROOT_DIRECTORY, `.env.${mode}`),
      path.join(PROJECT_ROOT_DIRECTORY, `.env.${mode}.local`),
    ];

    environmentFiles.forEach((file) => dotenv.config({ path: file }));
  }

  private readCloudinaryConfig(): CloudinaryConfig | null {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) return null;

    return { cloudName, apiKey, apiSecret };
  }
}

const globalConfig = new GlobalConfig();

export default globalConfig;
