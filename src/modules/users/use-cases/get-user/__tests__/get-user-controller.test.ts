/**
 * @jest-environment ./prisma/prisma-test-environment.ts
 */

import request from 'supertest';

import app from '@/shared/infra/http/app';
import HTTPResponse from '@/shared/infra/http/models/http-response';
import prisma from '@/shared/infra/prisma/prisma-client';

describe('Get user controller', () => {
  const URL = '/users';

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  it('should be able to get a user created', async () => {
    const userData = {
      name: 'Test name',
      email: 'test@test.com.br',
      password: '1234',
      phoneNumber: '123456789',
    };

    const userCreationResponse = await request(app).post(URL).send(userData);

    const { id } = userCreationResponse.body;

    const response = await request(app).get(`${URL}/${id}`);

    expect(response.statusCode).toBe(HTTPResponse.STATUS_CODE.OK);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body.name).toBe(userData.name);
    expect(response.body.email).toBe(userData.email);
    expect(response.body).not.toHaveProperty('password');
    expect(response.body.phoneNumber).toBe(userData.phoneNumber);
  });

  it('should not be able to get an uncreated user', async () => {
    const testId = 'ABC123';

    const response = await request(app).get(`${URL}/${testId}`);

    expect(response.statusCode).toBe(HTTPResponse.STATUS_CODE.NOT_FOUND);
    expect(response.body.message).toBe('User does not exists');
  });
});
