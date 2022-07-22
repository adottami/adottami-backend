/**
 * @jest-environment ./prisma/prisma-test-environment.ts
 */

import request, { Response } from 'supertest';

import User from '@/modules/users/entities/user';
import app from '@/shared/infra/http/app';
import HTTPResponse from '@/shared/infra/http/models/http-response';
import prisma from '@/shared/infra/prisma/prisma-client';

describe('Get publication controller', () => {
  const URL = '/publications';
  let accessToken: string;
  let userData: User;
  let userId: string;
  let createPubResponse: Response;

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

  it('should be able to get a publication not found and return null', async () => {
    const response = await request(app)
      .get(`${URL}/testId`)
      .set({
        Authorization: `Bearer ${accessToken}`,
      });

    expect(response.statusCode).toBe(HTTPResponse.STATUS_CODE.OK);
    expect(response.body).toBeNull();
  });

  it('should be able to get a publication and show author phone number', async () => {
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
    };

    createPubResponse = await request(app)
      .post(URL)
      .send(publicationData)
      .set({
        Authorization: `Bearer ${accessToken}`,
      });

    const response = await request(app)
      .get(`${URL}/${createPubResponse.body.id}`)
      .set({
        Authorization: `Bearer ${accessToken}`,
      });

    expect(response.statusCode).toBe(HTTPResponse.STATUS_CODE.OK);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body.author.name).toBe(userData.name);
    expect(response.body.author.email).toBe(userData.email);
    expect(response.body.author.phoneNumber).toBe(userData.phoneNumber);
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

  it('should be able to get a publication and not show author phone number', async () => {
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
      hidePhoneNumber: true,
      characteristics: [],
    };

    createPubResponse = await request(app)
      .post(URL)
      .send(publicationData)
      .set({
        Authorization: `Bearer ${accessToken}`,
      });

    const response = await request(app)
      .get(`${URL}/${createPubResponse.body.id}`)
      .set({
        Authorization: `Bearer ${accessToken}`,
      });

    expect(response.statusCode).toBe(HTTPResponse.STATUS_CODE.OK);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body.author.name).toBe(userData.name);
    expect(response.body.author.email).toBe(userData.email);
    expect(response.body.author).not.toHaveProperty('phoneNumber');
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
});
