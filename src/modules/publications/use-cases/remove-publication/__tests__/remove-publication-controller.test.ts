/**
 * @jest-environment ./prisma/prisma-test-environment.ts
 */

import request from 'supertest';

import PrismaPublicationRepository from '@/modules/publications/infra/prisma/repositories/prisma-publication-repository';
import PublicationRepository from '@/modules/publications/repositories/publication-repository';
import User from '@/modules/users/entities/user';
import app from '@/shared/infra/http/app';
import HTTPResponse from '@/shared/infra/http/models/http-response';
import prisma from '@/shared/infra/prisma/prisma-client';

describe('Remove publication controller', () => {
  let accessToken: string;
  let userData: User;
  let userId: string;
  let publicationRepository: PublicationRepository;

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
    publicationRepository = new PrismaPublicationRepository();
  });

  it('should be able to remove a publication', async () => {
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

    const removeResponse = await request(app)
      .delete(`/publications/${createResponse.body.id}`)
      .set({
        Authorization: `Bearer ${accessToken}`,
      });

    expect(removeResponse.statusCode).toBe(HTTPResponse.STATUS_CODE.NO_CONTENT);
    expect(await publicationRepository.findById(createResponse.body.id)).toBeNull();
  });
});
