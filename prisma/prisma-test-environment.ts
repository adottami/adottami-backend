import type { JestEnvironmentConfig, EnvironmentContext } from '@jest/environment';
import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import dotenv from 'dotenv';
import NodeEnvironment from 'jest-environment-node';
import path from 'path';
import { v4 as uuid } from 'uuid';

import { PROJECT_ROOT_DIRECTORY } from '@/config/global-config/constants';

const prismaBinary = path.join(PROJECT_ROOT_DIRECTORY, 'node_modules', '.bin', 'prisma');

dotenv.config({ path: path.join(PROJECT_ROOT_DIRECTORY, '.env.test') });

class PrismaTestEnvironment extends NodeEnvironment {
  private readonly schema: string;
  private readonly client: PrismaClient;
  private readonly url: string;

  constructor(config: JestEnvironmentConfig, _context: EnvironmentContext) {
    super(config, _context);

    this.schema = `test_${uuid()}`;
    this.client = new PrismaClient();
    this.url = `${process.env.DATABASE_URL}?schema=${this.schema}`;
  }

  async setup() {
    process.env.DATABASE_URL = this.url;
    this.global.process.env.DATABASE_URL = this.url;

    execSync(`${prismaBinary} db push --skip-generate`);

    return super.setup();
  }

  async teardown() {
    await this.client.$executeRawUnsafe(`drop schema if exists "${this.schema}" cascade`);
    await this.client.$disconnect();
  }
}

export default PrismaTestEnvironment;
