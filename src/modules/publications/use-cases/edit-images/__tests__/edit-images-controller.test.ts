/**
 * @jest-environment ./prisma/prisma-test-environment.ts
 */

import request from 'supertest';

import User from '@/modules/users/entities/user';
import app from '@/shared/infra/http/app';
import HTTPResponse from '@/shared/infra/http/models/http-response';
import prisma from '@/shared/infra/prisma/prisma-client';

describe('Edit images controller', () => {
  // const URL = '/publications/:id/images';
  let accessToken: string;
  let userData: User;
  let userId: string;

  beforeEach(async () => {
    await prisma.publication.deleteMany();

    userData = User.create({
      name: 'Test name',
      email: 'anytest@test.com.br',
      password: '1234',
      phoneNumber: '123456789',
    });

    const userCreationResponse = await request(app).post('/users').send(userData);

    const responseToken = await request(app).post('/sessions/login').send({
      email: userData.email,
      password: userData.password,
    });

    accessToken = responseToken.body.accessToken;
    userId = userCreationResponse.body.id;
  });

  it('should be able to edit images of the publication', async () => {
    const publicationData = {
      author: userData,
      name: 'string',
      description: 'string',
      category: 'string',
      gender: 'string',
      breed: 'string',
      weightInGrams: 14,
      ageInYears: 23,
      zipCode: 'string',
      city: 'string',
      state: 'string',
      isArchived: true,
      hidePhoneNumber: false,
      characteristics: [],
      images: [],
    };

    const responsePublication = await request(app)
      .post('/publications')
      .send(publicationData)
      .set({
        Authorization: `Bearer ${accessToken}`,
      });

    expect(responsePublication.statusCode).toBe(HTTPResponse.STATUS_CODE.CREATED);
    expect(responsePublication.body).toHaveProperty('id');
    expect(responsePublication.body).toHaveProperty('createdAt');
    expect(responsePublication.body.author.id).toBe(userId);
  });
});
