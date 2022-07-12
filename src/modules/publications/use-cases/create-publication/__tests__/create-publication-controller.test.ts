/**
 * @jest-environment ./prisma/prisma-test-environment.ts
 */

import request from 'supertest';

import app from '@/shared/infra/http/app';
import HTTPResponse from '@/shared/infra/http/models/http-response';
import prisma from '@/shared/infra/prisma/prisma-client';

describe('Create publication controller', () => {
  const URL = '/publications';

  beforeEach(async () => {
    await prisma.publication.deleteMany();
  });

  it('should be able to create a new publication', async () => {
    const publicationData = {
      authorId: 'string',
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
      characteristics: [
        {
          id: 'string',
          createdAt: 'Tue Jun 05 2018 17:23:42 GMT+0530 (IST)',
          name: 'string',
          publicationId: 'string',
          toJson: '',
        },
      ],
    };

    const response = await request(app).post(URL).send(publicationData);

    expect(response.statusCode).toBe(HTTPResponse.STATUS_CODE.CREATED);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body.name).toBe(publicationData.name);
    expect(response.body.description).toBe(publicationData.description);
    expect(response.body.category).not.toBe(publicationData.category);
    expect(response.body.gender).toBe(publicationData.gender);
    expect(response.body.breed).toBe(publicationData.breed);
    expect(response.body.weightInGrams).toBe(publicationData.weightInGrams);
    expect(response.body.ageInYears).toBe(publicationData.ageInYears);
    expect(response.body.zipCode).toBe(publicationData.zipCode);
    expect(response.body.city).toBe(publicationData.city);
    expect(response.body.state).toBe(publicationData.state);
    expect(response.body.isArchived).toBe(publicationData.isArchived);
    expect(response.body.hidePhoneNumber).toBe(publicationData.hidePhoneNumber);
    expect(response.body.characteristics).toBe(publicationData.characteristics);
  });
});
