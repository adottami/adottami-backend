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

describe('Update user controller', () => {
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

  it('should be able to update user', async () => {
    const userDataUpdate = {
      name: 'New test name',
      email: 'newtest@test.com.br',
      phoneNumber: '987654321',
    };

    const response = await request(app)
      .put(`${URL}/${userId}`)
      .send(userDataUpdate)
      .set({
        Authorization: `Bearer ${accessToken}`,
      });

    expect(response.statusCode).toEqual(HTTPResponse.STATUS_CODE.OK);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body.name).toBe(userDataUpdate.name);
    expect(response.body.email).toBe(userDataUpdate.email);
    expect(response.body).not.toHaveProperty('password');
    expect(response.body.phoneNumber).toBe(userDataUpdate.phoneNumber);
  });

  it('should not be able to update unregistered user', async () => {
    const tokenProvider = container.resolve<TokenProvider>('TokenProvider');

    const testId = 'ABC123';
    const testAccessToken = tokenProvider.generate({ subject: testId, expiresIn: '15m' });

    const response = await request(app)
      .put(`${URL}/${testId}`)
      .send({
        name: 'New test name',
        email: 'newtest@test.com.br',
        phoneNumber: '987654321',
      })
      .set({
        Authorization: `Bearer ${testAccessToken}`,
      });

    expect(response.statusCode).toBe(HTTPResponse.STATUS_CODE.NOT_FOUND);
    expect(response.body.message).toBe('User does not exists');
  });

  it('should not be able to update user with email already registered', async () => {
    const email = 'test2@test.com.br';

    await request(app).post(URL).send({
      name: 'Test name 2',
      email,
      password: '1234',
      phoneNumber: '123456789',
    });

    const response = await request(app)
      .put(`${URL}/${userId}`)
      .send({
        name: 'New test name',
        email,
        phoneNumber: '123456789',
      })
      .set({
        Authorization: `Bearer ${accessToken}`,
      });

    expect(response.statusCode).toBe(HTTPResponse.STATUS_CODE.BAD_REQUEST);
    expect(response.body.message).toBe('E-mail already registered');
  });
});
