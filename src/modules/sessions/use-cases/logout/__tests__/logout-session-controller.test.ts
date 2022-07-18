/**
 * @jest-environment ./prisma/prisma-test-environment.ts
 */
import request from 'supertest';

import User from '@/modules/users/entities/user';
import app from '@/shared/infra/http/app';
import HTTPResponse from '@/shared/infra/http/models/http-response';
import prisma from '@/shared/infra/prisma/prisma-client';

describe('Logout session controller test', () => {
  const URLLogoutSession = '/sessions/logout';
  const URLLoginSession = '/sessions/login';
  const URLAccessToken = '/sessions/access-token';
  const URLCreateUser = '/users';
  let accessToken: string;
  let refreshToken: string;
  let userId: string;

  beforeEach(async () => {
    await prisma.user.deleteMany();

    const userData = User.create({
      name: 'Test name',
      email: 'test@test.com.br',
      password: '1234',
      phoneNumber: '123456789',
    });

    await request(app).post(URLCreateUser).send(userData);

    const loginResponse = await request(app).post(URLLoginSession).send({
      email: userData.email,
      password: userData.password,
    });

    accessToken = loginResponse.body.accessToken;
    refreshToken = loginResponse.body.refreshToken;
    userId = loginResponse.body.id;
  });

  it('should be able to logout user', async () => {
    const response = await request(app)
      .post(URLLogoutSession)
      .send({ userId })
      .set({
        Authorization: `Bearer ${accessToken}`,
      });

    expect(response.statusCode).toBe(HTTPResponse.STATUS_CODE.NO_CONTENT);
  });

  it('should be able to invalidate all user refresh tokens at logout', async () => {
    await request(app).post(URLLoginSession).send({
      email: 'test@test.com.br',
      password: '1234',
    });

    await request(app)
      .post(URLLogoutSession)
      .send({ userId })
      .set({
        Authorization: `Bearer ${accessToken}`,
      });

    const refreshTokens = await prisma.refreshToken.findMany({});

    expect(refreshTokens).toHaveLength(0);

    const response = await request(app).post(URLAccessToken).send({ refreshToken });

    expect(response.statusCode).toBe(HTTPResponse.STATUS_CODE.BAD_REQUEST);
  });
});
