/**
 * @jest-environment ./prisma/prisma-test-environment.ts
 */

import request from 'supertest';
import { container } from 'tsyringe';

import User from '@/modules/users/entities/user';
import TokenProvider from '@/shared/container/providers/token-provider/token-provider';
import app from '@/shared/infra/http/app';
import HTTPResponse from '@/shared/infra/http/models/http-response';
import prisma from '@/shared/infra/prisma/prisma-client';

describe('Get user controller', () => {
  const URL = '/users';
  let accessToken: string;
  let userData: User;
  let userId: string;

  beforeEach(async () => {
    await prisma.user.deleteMany();

    userData = User.create({
      name: 'Test name',
      email: 'test@test.com.br',
      password: '1234',
      phoneNumber: '123456789',
    });

    const userCreationResponse = await request(app).post(URL).send(userData);

    const responseToken = await request(app).post('/sessions/login').send({
      email: userData.email,
      password: userData.password,
    });

    accessToken = responseToken.body.accessToken;
    userId = userCreationResponse.body.id;
  });

  it('should be able to get a user created', async () => {
    const response = await request(app)
      .get(`${URL}/${userId}`)
      .set({
        Authorization: `Bearer ${accessToken}`,
      });

    expect(response.statusCode).toBe(HTTPResponse.STATUS_CODE.OK);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body.name).toBe(userData.name);
    expect(response.body.email).toBe(userData.email);
    expect(response.body).not.toHaveProperty('password');
    expect(response.body.phoneNumber).toBe(userData.phoneNumber);
  });

  it('should not be able to get a user other than itself', async () => {
    const userCreationResponse = await request(app).post(URL).send({
      name: 'Test name',
      email: 'test2@test.com.br',
      password: '1234',
      phoneNumber: '123456789',
    });

    const { otherUserId } = userCreationResponse.body;

    const response = await request(app)
      .get(`${URL}/${otherUserId}`)
      .set({
        Authorization: `Bearer ${accessToken}`,
      });

    expect(response.statusCode).toBe(HTTPResponse.STATUS_CODE.UNAUTHORIZED);
    expect(response.body.message).toBe('Access denied');
  });

  it('should not be able to get an uncreated user', async () => {
    const tokenProvider = container.resolve<TokenProvider>('TokenProvider');

    const testId = 'ABC123';
    const testAccessToken = tokenProvider.generate({ subject: testId, expiresIn: '15m' });

    const response = await request(app)
      .get(`${URL}/${testId}`)
      .set({
        Authorization: `Bearer ${testAccessToken}`,
      });

    expect(response.statusCode).toBe(HTTPResponse.STATUS_CODE.NOT_FOUND);
    expect(response.body.message).toBe('User does not exists');
  });
});
