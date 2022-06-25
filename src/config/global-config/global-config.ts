import dotenv from 'dotenv';
import path from 'path';

import { PROJECT_ROOT_DIRECTORY } from './constants';
import { Mode } from './types';

export class GlobalConfig {
  private _mode: Mode;
  private _port: number;
  private _allowedCORSOrigins: string[];

  constructor() {
    this._mode = process.env.NODE_ENV ?? 'development';
    this.loadEnvironmentVariables(this.mode());
    this._port = Number(process.env.PORT);
    this._allowedCORSOrigins = process.env.ALLOWED_CORS_ORIGINS?.split(',') ?? ['*'];
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

  private loadEnvironmentVariables(mode: Mode) {
    const environmentFiles = [
      path.join(PROJECT_ROOT_DIRECTORY, `.env.${mode}`),
      path.join(PROJECT_ROOT_DIRECTORY, `.env.${mode}.local`),
    ];

    environmentFiles.forEach((file) => dotenv.config({ path: file }));
  }
}

const globalConfig = new GlobalConfig();

export default globalConfig;
