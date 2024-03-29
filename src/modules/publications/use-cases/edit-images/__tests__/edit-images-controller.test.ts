/**
 * @jest-environment ./prisma/prisma-test-environment.ts
 */

import request from 'supertest';

import User from '@/modules/users/entities/user';
import app from '@/shared/infra/http/app';
import HTTPResponse from '@/shared/infra/http/models/http-response';
import prisma from '@/shared/infra/prisma/prisma-client';

import { saveImageToFileSystem } from './utils';

describe('Edit images controller', () => {
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
    };

    const createResponse = await request(app)
      .post('/publications')
      .send(publicationData)
      .set({
        Authorization: `Bearer ${accessToken}`,
      });

    expect(createResponse.statusCode).toBe(HTTPResponse.STATUS_CODE.CREATED);
    expect(createResponse.body).toHaveProperty('id');
    expect(createResponse.body).toHaveProperty('createdAt');
    expect(createResponse.body.author.id).toBe(userId);

    const imageFilePath = await saveImageToFileSystem('edit-images-controller');

    const editResponse = await request(app)
      .patch(`/publications/${createResponse.body.id}/images`)
      .attach('images', imageFilePath)
      .set({
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`,
      });

    expect(editResponse.statusCode).toBe(HTTPResponse.STATUS_CODE.OK);
    expect(editResponse.body).toEqual({
      ...createResponse.body,
      images: [
        {
          id: expect.any(String),
          url: expect.any(String),
          createdAt: expect.any(String),
        },
      ],
    });
  });
});
