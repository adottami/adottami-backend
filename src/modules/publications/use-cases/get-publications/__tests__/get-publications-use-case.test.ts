import Publication from '@/modules/publications/entities/publication';
import PublicationRepositoryMock from '@/modules/publications/repositories/mocks/publication-repository-mock';
import PublicationRepository from '@/modules/publications/repositories/publication-repository';
import User from '@/modules/users/entities/user';

import GetPublicationsUseCase from '../get-publications-use-case';
import { addDays, getNameNumberList, getNumPublications } from './util';

describe('Get publications use case', () => {
  let publicationRepository: PublicationRepository;
  let useCase: GetPublicationsUseCase;
  let user: User;
  let publication: Publication;

  beforeEach(() => {
    publicationRepository = new PublicationRepositoryMock();
    useCase = new GetPublicationsUseCase(publicationRepository);

    user = User.create({
      name: 'Test name',
      email: 'test@test.com.br',
      password: '1234',
      phoneNumber: '123456789',
    });

    publication = Publication.create({
      author: user,
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
    });
  });

  it('should be able to get the publications by filtering by city and state', async () => {
    const numPublications = [2, 3, 4, 8];

    for (let i = 0; i < 10; i++) {
      const modifyPublication = { ...publication, name: `publication_${i}` };

      if (numPublications.includes(i)) {
        await publicationRepository.create(
          user.id,
          Publication.create({ ...modifyPublication, city: 'Campina Grande', state: 'PB' }),
        );
      } else {
        await publicationRepository.create(user.id, Publication.create(modifyPublication));
      }
    }

    const publications = await useCase.execute({
      city: 'Campina Grande',
      state: 'PB',
      categories: '',
      isArchived: false,
      authorId: '',
      page: 1,
      perPage: 20,
      orderBy: '',
    });

    expect(publications).toHaveLength(numPublications.length);
    expect(getNameNumberList(publications)).toEqual(numPublications);
  });

  it('should return an empty array if the city and state filter does not match', async () => {
    for (let i = 0; i < 10; i++) {
      await publicationRepository.create(user.id, Publication.create(publication));
    }

    const publications = await useCase.execute({
      city: 'Campina Grande',
      state: 'PB',
      categories: '',
      isArchived: false,
      authorId: '',
      page: 1,
      perPage: 20,
      orderBy: '',
    });

    expect(publications).toHaveLength(0);
    expect(publications).toEqual([]);
  });

  it('should be able to get the publications by filtering by city and state and categories', async () => {
    const numPublications = [2, 3, 4, 8];
    const categories = ['cat1', 'cat2', 'cat3'];

    for (let i = 0; i < 10; i++) {
      const modifyPublication = { ...publication, name: `publication_${i}` };

      if (numPublications.includes(i)) {
        await publicationRepository.create(
          user.id,
          Publication.create({ ...modifyPublication, category: categories[i % categories.length] }),
        );
      } else {
        await publicationRepository.create(user.id, Publication.create(modifyPublication));
      }
    }

    const publications = await useCase.execute({
      city: 'São Paulo',
      state: 'SP',
      categories: categories.join(','),
      isArchived: false,
      authorId: '',
      page: 1,
      perPage: 20,
      orderBy: '',
    });

    expect(publications).toHaveLength(numPublications.length);
    expect(getNameNumberList(publications)).toEqual(numPublications);
  });

  it('should be able to get the publications by filtering by city and state and isArchived', async () => {
    const numPublications = [2, 3, 4, 8];
    const numPublicationsOther = [0, 1, 5, 6, 7, 9];

    for (let i = 0; i < 10; i++) {
      const modifyPublication = { ...publication, name: `publication_${i}` };

      if (numPublications.includes(i)) {
        await publicationRepository.create(user.id, Publication.create({ ...modifyPublication, isArchived: true }));
      } else {
        await publicationRepository.create(user.id, Publication.create(modifyPublication));
      }
    }

    const publicationsIsArchivedTrue = await useCase.execute({
      city: 'São Paulo',
      state: 'SP',
      categories: '',
      isArchived: true,
      authorId: '',
      page: 1,
      perPage: 20,
      orderBy: '',
    });

    const publicationsIsArchivedFalse = await useCase.execute({
      city: 'São Paulo',
      state: 'SP',
      categories: '',
      isArchived: false,
      authorId: '',
      page: 1,
      perPage: 20,
      orderBy: '',
    });

    expect(publicationsIsArchivedTrue).toHaveLength(numPublications.length);
    expect(getNameNumberList(publicationsIsArchivedTrue)).toEqual(numPublications);
    expect(publicationsIsArchivedFalse).toHaveLength(numPublicationsOther.length);
    expect(getNameNumberList(publicationsIsArchivedFalse)).toEqual(numPublicationsOther);
  });

  it('should be able to get the publications by filtering by city and state and authorId', async () => {
    const otherUser = User.create({
      name: 'Test name 2',
      email: 'test2@test.com.br',
      password: '1234',
      phoneNumber: '123456789',
    });

    const numPublications = [2, 3, 4, 8];

    for (let i = 0; i < 10; i++) {
      const modifyPublication = { ...publication, name: `publication_${i}` };

      if (numPublications.includes(i)) {
        await publicationRepository.create(
          otherUser.id,
          Publication.create({ ...modifyPublication, author: otherUser }),
        );
      } else {
        await publicationRepository.create(user.id, Publication.create(modifyPublication));
      }
    }

    const publications = await useCase.execute({
      city: 'São Paulo',
      state: 'SP',
      categories: '',
      isArchived: false,
      authorId: otherUser.id,
      page: 1,
      perPage: 20,
      orderBy: '',
    });

    expect(publications).toHaveLength(numPublications.length);
    expect(getNameNumberList(publications)).toEqual(numPublications);
  });

  it('should be able to get the publications by filtering by city and state using pagination', async () => {
    for (let i = 0; i < 25; i++) {
      const modifyPublication = { ...publication, name: `publication_${i}` };
      await publicationRepository.create(user.id, Publication.create(modifyPublication));
    }

    const perPage = 5;
    const page = 1;

    const publicationsPage1 = await useCase.execute({
      city: 'São Paulo',
      state: 'SP',
      categories: '',
      isArchived: false,
      authorId: '',
      page,
      perPage,
      orderBy: '',
    });

    const publicationsPage2 = await useCase.execute({
      city: 'São Paulo',
      state: 'SP',
      categories: '',
      isArchived: false,
      authorId: '',
      page: page + 1,
      perPage,
      orderBy: '',
    });

    const publicationsPage4 = await useCase.execute({
      city: 'São Paulo',
      state: 'SP',
      categories: '',
      isArchived: false,
      authorId: '',
      page: page + 3,
      perPage,
      orderBy: '',
    });

    const publicationsPage15 = await useCase.execute({
      city: 'São Paulo',
      state: 'SP',
      categories: '',
      isArchived: false,
      authorId: '',
      page: page + 14,
      perPage,
      orderBy: '',
    });

    expect(publicationsPage1).toHaveLength(perPage);
    expect(getNameNumberList(publicationsPage1)).toEqual(getNumPublications(perPage, page));
    expect(publicationsPage2).toHaveLength(perPage);
    expect(getNameNumberList(publicationsPage2)).toEqual(getNumPublications(perPage, page + 1));
    expect(publicationsPage4).toHaveLength(perPage);
    expect(getNameNumberList(publicationsPage4)).toEqual(getNumPublications(perPage, page + 3));
    expect(publicationsPage15).toHaveLength(0);
    expect(publicationsPage15).toEqual([]);
  });

  it('should get the publications by filtering by city and state and sorting by creatdAt', async () => {
    const numPublications = [2, 3, 4, 8];

    for (let i = 0; i < 20; i++) {
      const modifyPublication = { ...publication, name: `publication_${i}` };

      if (numPublications.includes(i)) {
        await publicationRepository.create(
          user.id,
          Publication.create({ ...modifyPublication, createdAt: addDays(i) }),
        );
      } else {
        await publicationRepository.create(user.id, Publication.create(modifyPublication));
      }
    }

    const publications = await useCase.execute({
      city: 'São Paulo',
      state: 'SP',
      categories: '',
      isArchived: false,
      authorId: '',
      page: 5,
      perPage: 4,
      orderBy: 'createdAt',
    });

    expect(publications).toHaveLength(numPublications.length);
    expect(getNameNumberList(publications)).toEqual(numPublications);
  });

  it('should get the posts filtering by city and state and should not return the user phoneNumber if hidePhoneNumber is true', async () => {
    const totalPublications = 5;

    for (let i = 0; i < totalPublications; i++) {
      const modifyPublication = { ...publication, name: `publication_${i}`, hidePhoneNumber: true };

      await publicationRepository.create(user.id, Publication.create(modifyPublication));
    }

    const publications = await useCase.execute({
      city: 'São Paulo',
      state: 'SP',
      categories: '',
      isArchived: false,
      authorId: '',
      page: 1,
      perPage: totalPublications,
      orderBy: 'createdAt',
    });

    expect(publications).toHaveLength(5);
    expect(publications.map((publication) => publication.author.phoneNumber)).toEqual(
      Array(totalPublications).fill(undefined),
    );
  });

  it('should get the posts filtering by city and state and should return the user phoneNumber if hidePhoneNumber is false', async () => {
    const totalPublications = 5;

    for (let i = 0; i < totalPublications; i++) {
      const modifyPublication = { ...publication, name: `publication_${i}`, hidePhoneNumber: false };

      await publicationRepository.create(user.id, Publication.create(modifyPublication));
    }

    const publications = await useCase.execute({
      city: 'São Paulo',
      state: 'SP',
      categories: '',
      isArchived: false,
      authorId: '',
      page: 1,
      perPage: totalPublications,
      orderBy: 'createdAt',
    });

    expect(publications).toHaveLength(5);
    expect(publications.map((publication) => publication.author.phoneNumber)).toEqual(
      Array(totalPublications).fill(user.phoneNumber),
    );
  });
});
