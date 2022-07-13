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

describe('Create user controller', () => {
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

  it('should be able to update a user password', async () => {
    const updatePasswordData = {
      currentPassword: userData.password,
      newPassword: '12345',
    };

    const response = await request(app)
      .patch(`${URL}/${userId}/password`)
      .send(updatePasswordData)
      .set({
        Authorization: `Bearer ${accessToken}`,
      });

    expect(response.statusCode).toBe(HTTPResponse.STATUS_CODE.NO_CONTENT);
  });

  it('should not be able to update password if current password typed is wrong', async () => {
    const updatePasswordData = {
      currentPassword: 'testpassword',
      newPassword: '12345',
    };

    const response = await request(app)
      .patch(`${URL}/${userId}/password`)
      .send(updatePasswordData)
      .set({
        Authorization: `Bearer ${accessToken}`,
      });

    expect(response.statusCode).toBe(HTTPResponse.STATUS_CODE.BAD_REQUEST);
    expect(response.body.message).toBe('Current password is invalid');
  });

  it('should not be able to update password an uncreated user', async () => {
    const tokenProvider = container.resolve<TokenProvider>('TokenProvider');

    const testId = 'ABC123';
    const testAccessToken = tokenProvider.generate({ subject: testId, expiresIn: '15m' });

    const updatePasswordData = {
      currentPassword: userData.password,
      newPassword: '12345',
    };

    const response = await request(app)
      .patch(`${URL}/${testId}/password`)
      .send(updatePasswordData)
      .set({
        Authorization: `Bearer ${testAccessToken}`,
      });

    expect(response.statusCode).toBe(HTTPResponse.STATUS_CODE.BAD_REQUEST);
    expect(response.body.message).toBe('User does not exists');
  });
});
