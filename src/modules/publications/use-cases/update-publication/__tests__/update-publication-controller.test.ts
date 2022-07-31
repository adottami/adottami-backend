/**
 * @jest-environment ./prisma/prisma-test-environment.ts
 */

import request from 'supertest';

import User from '@/modules/users/entities/user';
import app from '@/shared/infra/http/app';
import HTTPResponse from '@/shared/infra/http/models/http-response';
import prisma from '@/shared/infra/prisma/prisma-client';

describe('Update publication controller', () => {
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

  it('should be able to update a publication', async () => {
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
    const responseCreate = await request(app)
      .post(URL)
      .send(publicationData)
      .set({
        Authorization: `Bearer ${accessToken}`,
      });

    const publicationId = responseCreate.body.id;

    const updateData = {
      name: 'new string',
      description: undefined,
      category: undefined,
      gender: 'new string',
      breed: undefined,
      weightInGrams: undefined,
      ageInYears: 12,
      zipCode: 'new string',
      city: undefined,
      state: undefined,
      isArchived: false,
      hidePhoneNumber: undefined,
      characteristics: undefined,
    };

    const response = await request(app)
      .patch(`${URL}/${publicationId}`)
      .send(updateData)
      .set({
        Authorization: `Bearer ${accessToken}`,
      });

    expect(response.statusCode).toBe(HTTPResponse.STATUS_CODE.OK);
    expect(response.body).toHaveProperty('id');
    expect(response.body.id).toBe(publicationId);
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body.author.id).toBe(responseCreate.body.author.id);
    expect(response.body.name).not.toBe(responseCreate.body.name);
    expect(response.body.description).toBe(responseCreate.body.description);
    expect(response.body.category).toBe(responseCreate.body.category);
    expect(response.body.gender).not.toBe(responseCreate.body.gender);
    expect(response.body.breed).toBe(responseCreate.body.breed);
    expect(response.body.weightInGrams).toBe(responseCreate.body.weightInGrams);
    expect(response.body.ageInYears).not.toBe(responseCreate.body.ageInYears);
    expect(response.body.zipCode).not.toBe(responseCreate.body.zipCode);
    expect(response.body.city).toBe(responseCreate.body.city);
    expect(response.body.state).toBe(responseCreate.body.state);
    expect(response.body.isArchived).not.toBe(responseCreate.body.isArchived);
    expect(response.body.hidePhoneNumber).toBe(responseCreate.body.hidePhoneNumber);
    expect(response.body.characteristics).toEqual(responseCreate.body.characteristics);
  });

  it('should not be able to update an uncreated publication', async () => {
    const updateData = {
      id: 'randomId',
      name: 'new string',
      description: undefined,
      category: undefined,
      gender: 'new string',
      breed: undefined,
      weightInGrams: undefined,
      ageInYears: 12,
      zipCode: 'new string',
      city: undefined,
      state: undefined,
      isArchived: false,
      hidePhoneNumber: undefined,
      characteristics: undefined,
    };

    const response = await request(app)
      .patch(`${URL}/${'randomId'}`)
      .send(updateData)
      .set({
        Authorization: `Bearer ${accessToken}`,
      });

    expect(response.statusCode).toBe(HTTPResponse.STATUS_CODE.NOT_FOUND);
    expect(response.body.message).toBe('Publication not found');
  });

  it('should not be able to update a publication of another user', async () => {
    const anotherUserData = User.create({
      name: 'Test name 2',
      email: 'test2@test.com.br',
      password: '12345',
      phoneNumber: '123456780',
    });

    const anotherUserCreationResponse = await request(app).post('/users').send(anotherUserData);

    const responseToken = await request(app).post('/sessions/login').send({
      email: anotherUserData.email,
      password: anotherUserData.password,
    });

    const anotherUserAccessToken = responseToken.body.accessToken;
    const anotherUserId = anotherUserCreationResponse.body.id;

    const publicationData = {
      authorId: anotherUserId,
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
    const responseCreate = await request(app)
      .post(URL)
      .send(publicationData)
      .set({
        Authorization: `Bearer ${anotherUserAccessToken}`,
      });

    const publicationId = responseCreate.body.id;

    const updateData = {
      name: 'new string',
      description: undefined,
      category: undefined,
      gender: 'new string',
      breed: undefined,
      weightInGrams: undefined,
      ageInYears: 12,
      zipCode: 'new string',
      city: undefined,
      state: undefined,
      isArchived: false,
      hidePhoneNumber: undefined,
      characteristics: undefined,
    };

    const response = await request(app)
      .patch(`${URL}/${publicationId}`)
      .send(updateData)
      .set({
        Authorization: `Bearer ${accessToken}`,
      });

    expect(response.statusCode).toBe(HTTPResponse.STATUS_CODE.FORBIDDEN);
    expect(response.body.message).toBe("User isn't publication author");
  });
});
