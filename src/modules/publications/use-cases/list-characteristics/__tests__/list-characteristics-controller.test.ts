/**
 * @jest-environment ./prisma/prisma-test-environment.ts
 */

import request from 'supertest';

import User from '@/modules/users/entities/user';
import app from '@/shared/infra/http/app';
import HTTPResponse from '@/shared/infra/http/models/http-response';
import prisma from '@/shared/infra/prisma/prisma-client';

describe('List characteristics controller', () => {
  const URL = '/publications/characteristics';
  const URLUsers = '/users';
  let accessToken: string;

  beforeEach(async () => {
    await prisma.user.deleteMany();

    const userData = User.create({
      name: 'Test name',
      email: 'test@test.com.br',
      password: '1234',
      phoneNumber: '123456789',
    });

    await request(app).post(URLUsers).send(userData);

    const responseToken = await request(app).post('/sessions/login').send({
      email: userData.email,
      password: userData.password,
    });

    accessToken = responseToken.body.accessToken;
  });

  it('should be able to get characteristics list', async () => {
    const response = await request(app)
      .get(URL)
      .set({
        Authorization: `Bearer ${accessToken}`,
      });

    expect(response.statusCode).toBe(HTTPResponse.STATUS_CODE.OK);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: '1', name: 'Brincalhão' }),
        expect.objectContaining({ id: '2', name: 'Dócil' }),
        expect.objectContaining({ id: '3', name: 'Calmo' }),
        expect.objectContaining({ id: '4', name: 'Sociável' }),
        expect.objectContaining({ id: '5', name: 'Sociável com crianças' }),
        expect.objectContaining({ id: '6', name: 'Castrado' }),
        expect.objectContaining({ id: '7', name: 'Vacinado' }),
        expect.objectContaining({ id: '8', name: 'Vermifugado' }),
        expect.objectContaining({ id: '9', name: 'Vive bem em apartamento' }),
        expect.objectContaining({ id: '10', name: 'Vive bem em casa com quintal' }),
      ]),
    );
  });
});
