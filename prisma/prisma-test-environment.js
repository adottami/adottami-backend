import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import dotenv from 'dotenv';
import NodeEnvironment from 'jest-environment-node';
import path from 'path';
import { v4 as uuid } from 'uuid';

import { PROJECT_ROOT_DIRECTORY } from '../src/config/global-config/constants';

dotenv.config({ path: path.join(PROJECT_ROOT_DIRECTORY, '.env.test') });

class PrismaTestEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);

    this.schema = `test_${uuid()}`;
    this.client = new PrismaClient();
    this.url = `${process.env.DATABASE_URL}?schema=${this.schema}`;
  }

  async setup() {
    process.env.DATABASE_URL = this.url;
    this.global.process.env.DATABASE_URL = this.url;

    execSync(`yarn prisma migrate dev`);

    return super.setup();
  }

  async teardown() {
    await this.client.$executeRawUnsafe(`drop schema if exists "${this.schema}" cascade`);
    await this.client.$disconnect();
  }
}

export default PrismaTestEnvironment;
