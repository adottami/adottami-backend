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

describe('Create publication controller', () => {
  const URL = '/publications';
  let accessToken: string;
  let userData: User;
  let userId: string;

  beforeEach(async () => {
    await prisma.publication.deleteMany();

    userData = User.create({
      name: 'Test name',
      email: 'test@test.com.br',
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

  it('should be able to create a new publication', async () => {
    const publicationData = {
      authorId: userId,
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
    const response = await request(app)
      .post(URL)
      .send(publicationData)
      .set({
        Authorization: `Bearer ${accessToken}`,
      });

    expect(response.statusCode).toBe(HTTPResponse.STATUS_CODE.CREATED);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body.author.id).toBe(userId);
    expect(response.body.name).toBe(publicationData.name);
    expect(response.body.description).toBe(publicationData.description);
    expect(response.body.category).toBe(publicationData.category);
    expect(response.body.gender).toBe(publicationData.gender);
    expect(response.body.breed).toBe(publicationData.breed);
    expect(response.body.weightInGrams).toBe(publicationData.weightInGrams);
    expect(response.body.ageInYears).toBe(publicationData.ageInYears);
    expect(response.body.zipCode).toBe(publicationData.zipCode);
    expect(response.body.city).toBe(publicationData.city);
    expect(response.body.state).toBe(publicationData.state);
    expect(response.body.isArchived).toBe(publicationData.isArchived);
    expect(response.body.hidePhoneNumber).toBe(publicationData.hidePhoneNumber);
    expect(response.body.characteristics).toEqual(publicationData.characteristics);
  });

  it('should not be able to create an publication with uncreated author', async () => {
    const tokenProvider = container.resolve<TokenProvider>('TokenProvider');

    const testId = 'ABC123';
    const testAccessToken = tokenProvider.generate({ subject: testId, expiresIn: '15m' });

    const publicationData = {
      authorId: testId,
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
    const response = await request(app)
      .post(URL)
      .send(publicationData)
      .set({
        Authorization: `Bearer ${testAccessToken}`,
      });
    expect(response.statusCode).toBe(HTTPResponse.STATUS_CODE.BAD_REQUEST);
    expect(response.body.message).toBe('Author does not exists');
  });
});
