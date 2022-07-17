/**
 * @jest-environment ./prisma/prisma-test-environment.ts
 */

import request from 'supertest';

import app from '@/shared/infra/http/app';
import HTTPResponse from '@/shared/infra/http/models/http-response';
import prisma from '@/shared/infra/prisma/prisma-client';

describe('Access token controller', () => {
  const URLLoginSession = '/sessions/login';
  const URLAccessToken = '/sessions/access-token';
  const URLCreateUser = '/users';

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  it('should be able to get access token', async () => {
    await request(app).post(URLCreateUser).send({
      name: 'Test name',
      email: 'test@test.com.br',
      password: '1234',
      phoneNumber: '123456789',
    });

    const loginResponse = await request(app).post(URLLoginSession).send({
      email: 'test@test.com.br',
      password: '1234',
    });

    const { refreshToken } = loginResponse.body;

    const response = await request(app).post(URLAccessToken).send({ refreshToken });

    expect(response.statusCode).toBe(HTTPResponse.STATUS_CODE.CREATED);
    expect(response.body).toHaveProperty('accessToken');
  });
});
