import Publication from '@/modules/publications/entities/publication';
import PublicationRepositoryMock from '@/modules/repositories/mocks/publication-repository-mock';
import PublicationRepository from '@/modules/repositories/publication-repository';
import UserRepository from '@/modules/users/repositories/user-repository';

import CreatePublicationUseCase from '../create-publication-use-case';

describe('Create publication use case', () => {
  let publicationRepository: PublicationRepository;
  let userRepository: UserRepository;
  let useCase: CreatePublicationUseCase;

  beforeEach(() => {
    publicationRepository = new PublicationRepositoryMock();
    useCase = new CreatePublicationUseCase(publicationRepository, userRepository);
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
      characteristics: [],
    };

    const publication = await useCase.execute(publicationData);

    expect(publication).toBeInstanceOf(Publication);
    expect(publication).toHaveProperty('id');
    expect(publication).toHaveProperty('createdAt');
    expect(publication.name).toBe(publicationData.name);
    expect(publication.description).toBe(publicationData.description);
    expect(publication.category).not.toBe(publicationData.category);
    expect(publication.gender).toBe(publicationData.gender);
    expect(publication.breed).toBe(publicationData.breed);
    expect(publication.weightInGrams).toBe(publicationData.weightInGrams);
    expect(publication.ageInYears).toBe(publicationData.ageInYears);
    expect(publication.zipCode).toBe(publicationData.zipCode);
    expect(publication.city).toBe(publicationData.city);
    expect(publication.state).toBe(publicationData.state);
    expect(publication.isArchived).toBe(publicationData.isArchived);
    expect(publication.hidePhoneNumber).toBe(publicationData.hidePhoneNumber);
    expect(publication.characteristics).toBe(publicationData.characteristics);
  });
});
