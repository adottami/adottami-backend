/**
 * @jest-environment ./prisma/prisma-test-environment.ts
 */

import request from 'supertest';

import app from '@/shared/infra/http/app';
import HTTPResponse from '@/shared/infra/http/models/http-response';
import prisma from '@/shared/infra/prisma/prisma-client';

describe('Login session controller', () => {
  const URLLoginSession = '/sessions/login';
  const URLCreateUser = '/users';

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  it('should be able to login user', async () => {
    await request(app).post(URLCreateUser).send({
      name: 'Test name',
      email: 'test@test.com.br',
      password: '1234',
      phoneNumber: '123456789',
    });

    const loginData = {
      email: 'test@test.com.br',
      password: '1234',
    };

    const response = await request(app).post(URLLoginSession).send(loginData);

    expect(response.statusCode).toBe(HTTPResponse.STATUS_CODE.CREATED);
    expect(response.body).toHaveProperty('user');
    expect(response.body).toHaveProperty('accessToken');
    expect(response.body.user.email).toBe(loginData.email);
    expect(response.body.user).not.toHaveProperty('password');
    expect(response.body.user).toHaveProperty('name');
    expect(response.body.user).toHaveProperty('phoneNumber');
  });

  it('shoud not be able to login user by incorrent email', async () => {
    await request(app).post(URLCreateUser).send({
      name: 'Test name',
      email: 'test@test.com.br',
      password: '1234',
      phoneNumber: '123456789',
    });

    const loginData = {
      email: 'test2@test.com.br',
      password: '1234',
    };

    const response = await request(app).post(URLLoginSession).send(loginData);

    expect(response.statusCode).toBe(HTTPResponse.STATUS_CODE.BAD_REQUEST);
    expect(response.body.message).toBe('Email or password incorrect');
  });

  it('shoud not be able to login user by incorrent password', async () => {
    await request(app).post(URLCreateUser).send({
      name: 'Test name',
      email: 'test@test.com.br',
      password: '1234',
      phoneNumber: '123456789',
    });

    const loginData = {
      email: 'test@test.com.br',
      password: '12345',
    };

    const response = await request(app).post(URLLoginSession).send(loginData);

    expect(response.statusCode).toBe(HTTPResponse.STATUS_CODE.BAD_REQUEST);
    expect(response.body.message).toBe('Email or password incorrect');
  });
});
