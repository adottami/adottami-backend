/**
 * @jest-environment ./prisma/prisma-test-environment
 */

import request from 'supertest';

import app from '@/shared/infra/http/app';
import prisma from '@/shared/infra/prisma/prisma-client';

describe('Create user controller', () => {
  const URL = '/users';

  afterEach(async () => {
    await prisma.user.deleteMany();
  });

  it('should be able to create a new user', async () => {
    const response = await request(app).post(URL).send({
      name: 'Test name',
      email: 'test@gmail.com',
      password: '1234',
      phoneNumber: '123456789',
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it('should not be able to create a new user with email already registered', async () => {
    const email = 'test@gmail.com';

    await request(app).post(URL).send({
      name: 'Test name',
      email,
      password: '1234',
      phoneNumber: '123456789',
    });

    const response = await request(app).post(URL).send({
      name: 'Test name 2',
      email,
      password: '1200',
      phoneNumber: '123456789',
    });

    expect(response.statusCode).toBe(400);
  });
});
