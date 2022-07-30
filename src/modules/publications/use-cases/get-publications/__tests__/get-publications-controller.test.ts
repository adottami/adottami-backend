/**
 * @jest-environment ./prisma/prisma-test-environment.ts
 */

import request from 'supertest';

import Publication from '@/modules/publications/entities/publication';
import User from '@/modules/users/entities/user';
import app from '@/shared/infra/http/app';
import HTTPResponse from '@/shared/infra/http/models/http-response';
import prisma from '@/shared/infra/prisma/prisma-client';

import { getNameNumberList } from './util';

describe('Get publications controller', () => {
  const URL = '/publications';
  let accessToken: string;
  let userData: User;
  let userId: string;
  let publicationData: Record<string, unknown>;

  beforeEach(async () => {
    await prisma.publication.deleteMany();
    await prisma.user.deleteMany();

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

    publicationData = {
      authorId: userId,
      name: '',
      description: '',
      category: '',
      gender: '',
      breed: '',
      weightInGrams: 4,
      ageInYears: 4,
      zipCode: '',
      city: 'São Paulo',
      state: 'SP',
      isArchived: false,
      hidePhoneNumber: false,
      characteristics: [],
      images: [],
    };
  });

  it('should be able to get the publications by filtering by city and state', async () => {
    const numPublications = [2, 3, 4, 7];
    const totalPublications = 8;

    for (let i = 0; i < totalPublications; i++) {
      const modifyPublication = { ...publicationData, name: `publication_${i}` };

      if (numPublications.includes(i)) {
        await request(app)
          .post(URL)
          .send({ ...modifyPublication, city: 'Campina Grande', state: 'PB' })
          .set({
            Authorization: `Bearer ${accessToken}`,
          });
      } else {
        await request(app)
          .post(URL)
          .send(modifyPublication)
          .set({
            Authorization: `Bearer ${accessToken}`,
          });
      }
    }

    const publicationsResponse = await request(app).get(URL).query({
      city: 'Campina Grande',
      state: 'PB',
      categories: '',
      isArchived: false,
      authorId: '',
      page: 1,
      perPage: 20,
    });

    expect(publicationsResponse.statusCode).toEqual(HTTPResponse.STATUS_CODE.OK);
    expect(publicationsResponse.body).toHaveLength(numPublications.length);
    expect(getNameNumberList(publicationsResponse.body)).toEqual(expect.arrayContaining(numPublications));
  });

  it('should return an empty array if the city and state filter does not match', async () => {
    const totalPublications = 2;

    for (let i = 0; i < totalPublications; i++) {
      const modifyPublication = { ...publicationData, name: `publication_${i}` };
      await request(app)
        .post(URL)
        .send(modifyPublication)
        .set({
          Authorization: `Bearer ${accessToken}`,
        });
    }

    const publicationsResponse = await request(app).get(URL).query({
      city: 'Campina Grande',
      state: 'PB',
      categories: '',
      isArchived: false,
      authorId: '',
      page: 1,
      perPage: 20,
    });

    expect(publicationsResponse.statusCode).toEqual(HTTPResponse.STATUS_CODE.OK);
    expect(publicationsResponse.body).toHaveLength(0);
    expect(publicationsResponse.body).toEqual([]);
  });

  it('should be able to get the publications by filtering by city and state and categories', async () => {
    const numPublications = [2, 3, 4, 7];
    const categories = ['cat1', 'cat2', 'cat3'];
    const totalPublications = 8;

    for (let i = 0; i < totalPublications; i++) {
      const modifyPublication = { ...publicationData, name: `publication_${i}` };

      if (numPublications.includes(i)) {
        await request(app)
          .post(URL)
          .send({ ...modifyPublication, category: categories[i % categories.length] })
          .set({
            Authorization: `Bearer ${accessToken}`,
          });
      } else {
        await request(app)
          .post(URL)
          .send(modifyPublication)
          .set({
            Authorization: `Bearer ${accessToken}`,
          });
      }
    }

    const publicationsResponse = await request(app)
      .get(URL)
      .query({
        city: 'São Paulo',
        state: 'SP',
        categories: categories.join(','),
        isArchived: false,
        authorId: '',
        page: 1,
        perPage: 20,
      });

    expect(publicationsResponse.statusCode).toEqual(HTTPResponse.STATUS_CODE.OK);
    expect(publicationsResponse.body).toHaveLength(numPublications.length);
    expect(getNameNumberList(publicationsResponse.body)).toEqual(expect.arrayContaining(numPublications));
  });

  it('should be able to get the publications by filtering by city and state and isArchived', async () => {
    const numPublications = [2, 3, 4, 7];
    const numPublicationsOther = [0, 1, 5, 6];
    const totalPublications = 8;

    for (let i = 0; i < totalPublications; i++) {
      const modifyPublication = { ...publicationData, name: `publication_${i}` };

      if (numPublications.includes(i)) {
        await request(app)
          .post(URL)
          .send({ ...modifyPublication, isArchived: true })
          .set({
            Authorization: `Bearer ${accessToken}`,
          });
      } else {
        await request(app)
          .post(URL)
          .send(modifyPublication)
          .set({
            Authorization: `Bearer ${accessToken}`,
          });
      }
    }

    const publicationsIsArchivedTrueResponse = await request(app).get(URL).query({
      city: 'São Paulo',
      state: 'SP',
      categories: '',
      isArchived: true,
      authorId: '',
      page: 1,
      perPage: 20,
    });

    const publicationsIsArchivedFalseResponse = await request(app).get(URL).query({
      city: 'São Paulo',
      state: 'SP',
      categories: '',
      isArchived: false,
      authorId: '',
      page: 1,
      perPage: 20,
    });

    expect(publicationsIsArchivedTrueResponse.statusCode).toEqual(HTTPResponse.STATUS_CODE.OK);
    expect(publicationsIsArchivedTrueResponse.body).toHaveLength(numPublications.length);
    expect(getNameNumberList(publicationsIsArchivedTrueResponse.body)).toEqual(expect.arrayContaining(numPublications));
    expect(publicationsIsArchivedFalseResponse.statusCode).toEqual(HTTPResponse.STATUS_CODE.OK);
    expect(publicationsIsArchivedFalseResponse.body).toHaveLength(numPublicationsOther.length);
    expect(getNameNumberList(publicationsIsArchivedFalseResponse.body)).toEqual(
      expect.arrayContaining(numPublicationsOther),
    );
  });

  it('should be able to get the publications by filtering by city and state and authorId', async () => {
    const otherUserData = User.create({
      name: 'Test name',
      email: 'test2@test.com.br',
      password: '1234',
      phoneNumber: '123456789',
    });

    const userCreationResponse = await request(app).post('/users').send(otherUserData);

    const otherUser = userCreationResponse.body;

    const responseToken = await request(app).post('/sessions/login').send({
      email: otherUserData.email,
      password: otherUserData.password,
    });

    const accessTokenOtherUser = responseToken.body.accessToken;

    const numPublications = [2, 3, 4, 7];
    const totalPublications = 8;

    for (let i = 0; i < totalPublications; i++) {
      const modifyPublication = { ...publicationData, name: `publication_${i}` };

      if (numPublications.includes(i)) {
        await request(app)
          .post(URL)
          .send({ ...modifyPublication, authorId: otherUser.id })
          .set({
            Authorization: `Bearer ${accessTokenOtherUser}`,
          });
      } else {
        await request(app)
          .post(URL)
          .send(modifyPublication)
          .set({
            Authorization: `Bearer ${accessToken}`,
          });
      }
    }

    const publications = await request(app).get(URL).query({
      city: 'São Paulo',
      state: 'SP',
      categories: '',
      isArchived: false,
      authorId: otherUser.id,
      page: 1,
      perPage: 20,
    });

    expect(publications.statusCode).toEqual(HTTPResponse.STATUS_CODE.OK);
    expect(publications.body).toHaveLength(numPublications.length);
    expect(getNameNumberList(publications.body)).toEqual(expect.arrayContaining(numPublications));
  });

  it('should be able to get the publications by filtering by city and state using pagination', async () => {
    const publicationData = {
      authorId: userId,
      name: '',
      description: '',
      category: '',
      gender: '',
      breed: '',
      weightInGrams: 4,
      ageInYears: 4,
      zipCode: '',
      city: 'São Paulo',
      state: 'SP',
      isArchived: false,
      hidePhoneNumber: false,
      characteristics: [],
      images: [],
    };

    const totalPublications = 25;

    for (let i = 0; i < totalPublications; i++) {
      const modifyPublication = { ...publicationData, name: i < 10 ? `publication_0${i}` : `publication_${i}` };

      await request(app)
        .post(URL)
        .send(modifyPublication)
        .set({
          Authorization: `Bearer ${accessToken}`,
        });
    }

    const perPage = 5;
    const page = 1;

    const publicationsPage1Response = await request(app).get(URL).query({
      city: 'São Paulo',
      state: 'SP',
      categories: '',
      isArchived: false,
      authorId: '',
      page,
      perPage,
      orderBy: 'most-recently-created',
    });

    const publicationsPage2Response = await request(app)
      .get(URL)
      .query({
        city: 'São Paulo',
        state: 'SP',
        categories: '',
        isArchived: false,
        authorId: '',
        page: page + 1,
        perPage,
        orderBy: 'most-recently-created',
      });

    const publicationsPage4Response = await request(app)
      .get(URL)
      .query({
        city: 'São Paulo',
        state: 'SP',
        categories: '',
        isArchived: false,
        authorId: '',
        page: page + 3,
        perPage,
        orderBy: 'most-recently-created',
      });

    const publicationsPage15Response = await request(app)
      .get(URL)
      .query({
        city: 'São Paulo',
        state: 'SP',
        categories: '',
        isArchived: false,
        authorId: '',
        page: page + 14,
        perPage,
        orderBy: 'most-recently-created',
      });

    expect(publicationsPage1Response.statusCode).toEqual(HTTPResponse.STATUS_CODE.OK);
    expect(getNameNumberList(publicationsPage1Response.body)).toEqual([24, 23, 22, 21, 20]);
    expect(publicationsPage2Response.statusCode).toEqual(HTTPResponse.STATUS_CODE.OK);
    expect(getNameNumberList(publicationsPage2Response.body)).toEqual([19, 18, 17, 16, 15]);
    expect(publicationsPage4Response.statusCode).toEqual(HTTPResponse.STATUS_CODE.OK);
    expect(getNameNumberList(publicationsPage4Response.body)).toEqual([9, 8, 7, 6, 5]);
    expect(publicationsPage15Response.statusCode).toEqual(HTTPResponse.STATUS_CODE.OK);
    expect(publicationsPage15Response.body).toHaveLength(0);
    expect(publicationsPage15Response.body).toEqual([]);
  });

  it('should get the publications by filtering by city and state and sorting them', async () => {
    const totalPublications = 8;

    for (let i = 0; i < totalPublications; i++) {
      const modifyPublication = {
        ...publicationData,
        name: `publication_${totalPublications - i}`,
      };

      await request(app)
        .post(URL)
        .send(modifyPublication)
        .set({
          Authorization: `Bearer ${accessToken}`,
        });
    }

    const perPage = 4;

    const publicationsOrderByNameResponse = await request(app).get(URL).query({
      city: 'São Paulo',
      state: 'SP',
      categories: '',
      isArchived: false,
      authorId: '',
      page: 1,
      perPage,
      orderBy: 'most-recently-created',
    });

    expect(publicationsOrderByNameResponse.statusCode).toEqual(HTTPResponse.STATUS_CODE.OK);
    expect(publicationsOrderByNameResponse.body).toHaveLength(perPage);
    expect(getNameNumberList(publicationsOrderByNameResponse.body)).toEqual([1, 2, 3, 4]);
  });

  it('should get the posts filtering by city and state and should not return the user phoneNumber if hidePhoneNumber is true', async () => {
    const totalPublications = 5;

    for (let i = 0; i < totalPublications; i++) {
      const modifyPublication = { ...publicationData, name: `publication_${i}`, hidePhoneNumber: true };

      await request(app)
        .post(URL)
        .send(modifyPublication)
        .set({
          Authorization: `Bearer ${accessToken}`,
        });
    }

    const publicationsResponse = await request(app).get(URL).query({
      city: 'São Paulo',
      state: 'SP',
      categories: '',
      isArchived: false,
      authorId: '',
      page: 1,
      perPage: totalPublications,
    });

    expect(publicationsResponse.statusCode).toEqual(HTTPResponse.STATUS_CODE.OK);
    expect(publicationsResponse.body).toHaveLength(totalPublications);
    expect(publicationsResponse.body.map((publication: Publication) => publication.author.phoneNumber)).toEqual(
      Array(totalPublications).fill(undefined),
    );
  });

  it('should get the posts filtering by city and state and should return the user phoneNumber if hidePhoneNumber is false', async () => {
    const totalPublications = 5;

    for (let i = 0; i < totalPublications; i++) {
      const modifyPublication = { ...publicationData, name: `publication_${i}`, hidePhoneNumber: false };

      await request(app)
        .post(URL)
        .send(modifyPublication)
        .set({
          Authorization: `Bearer ${accessToken}`,
        });
    }

    const publicationsResponse = await request(app).get(URL).query({
      city: 'São Paulo',
      state: 'SP',
      categories: '',
      isArchived: false,
      authorId: '',
      page: 1,
      perPage: totalPublications,
    });

    expect(publicationsResponse.statusCode).toEqual(HTTPResponse.STATUS_CODE.OK);
    expect(publicationsResponse.body).toHaveLength(totalPublications);
    expect(publicationsResponse.body.map((publication: Publication) => publication.author.phoneNumber)).toEqual(
      Array(totalPublications).fill(userData.phoneNumber),
    );
  });
});
