/**
 * @jest-environment ./prisma/prisma-test-environment.ts
 */

import request from 'supertest';

import app from '@/shared/infra/http/app';
import HTTPResponse from '@/shared/infra/http/models/http-response';
import prisma from '@/shared/infra/prisma/prisma-client';

describe('Create user controller', () => {
  const URL = '/users';

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  it('should be able to create a new user', async () => {
    const userData = {
      name: 'Test name',
      email: 'test@test.com.br',
      password: '1234',
      phoneNumber: '123456789',
    };

    const response = await request(app).post(URL).send(userData);

    expect(response.statusCode).toBe(HTTPResponse.STATUS_CODE.CREATED);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body.name).toBe(userData.name);
    expect(response.body.email).toBe(userData.email);
    expect(response.body).not.toHaveProperty('password');
    expect(response.body.phoneNumber).toBe(userData.phoneNumber);
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

    expect(response.statusCode).toBe(HTTPResponse.STATUS_CODE.BAD_REQUEST);
    expect(response.body.message).toBe('User already exists');
  });
});
