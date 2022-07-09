import type { JestEnvironmentConfig, EnvironmentContext } from '@jest/environment';
import { PrismaClient } from '@prisma/client';
import childProcess from 'child_process';
import crypto from 'crypto';
import dotenv from 'dotenv';
import NodeEnvironment from 'jest-environment-node';
import path from 'path';

import { PROJECT_ROOT_DIRECTORY } from '@/config/global-config/constants';

const PRISMA_BINARY_PATH = path.join(PROJECT_ROOT_DIRECTORY, 'node_modules', '.bin', 'prisma');

class PrismaTestEnvironment extends NodeEnvironment {
  private client: PrismaClient;
  private schemaName: string;
  private databaseURL: string;

  constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
    super(config, context);

    this.loadEnvironmentVariables();

    this.client = new PrismaClient();
    this.schemaName = this.generateSchemaName(context);
    this.databaseURL = `${process.env.DATABASE_URL}?schema=${this.schemaName}`;
  }

  private loadEnvironmentVariables() {
    const environmentFilePath = path.join(PROJECT_ROOT_DIRECTORY, '.env.test');
    dotenv.config({ path: environmentFilePath });
  }

  private generateSchemaName(context: EnvironmentContext): string {
    return crypto.createHash('shake256', { outputLength: 16 }).update(context.testPath).digest('base64');
  }

  async setup() {
    process.env.DATABASE_URL = this.databaseURL;
    this.global.process.env.DATABASE_URL = this.databaseURL;

    await this.applyPrismaSchemaToDatabase();
    await super.setup();
  }

  private async applyPrismaSchemaToDatabase() {
    await new Promise<void>((resolve, reject) => {
      childProcess.exec(`${PRISMA_BINARY_PATH} db push --skip-generate`, (error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }

  async teardown() {
    await this.client.$queryRaw`DROP SCHEMA IF EXISTS "${this.schemaName}" CASCADE`;
    await this.client.$disconnect();
  }
}

export default PrismaTestEnvironment;
