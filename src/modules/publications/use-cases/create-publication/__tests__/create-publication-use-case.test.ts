import Publication from '@/modules/publications/entities/publication';
import CharacteristicRepository from '@/modules/publications/repositories/characteristic-repository';
import CharacteristicRepositoryMock from '@/modules/publications/repositories/mocks/characteristic-repository-mock';
import PublicationRepositoryMock from '@/modules/repositories/mocks/publication-repository-mock';
import PublicationRepository from '@/modules/repositories/publication-repository';
import UserRepositoryMock from '@/modules/users/repositories/mocks/user-repository-mock';
import UserRepository from '@/modules/users/repositories/user-repository';
import CreateUserUseCase from '@/modules/users/use-cases/create-user/create-user-use-case';
import HashProvider from '@/shared/container/providers/hash-provider/hash-provider';
import HashProviderMock from '@/shared/container/providers/hash-provider/mocks/hash-provider-mock';

import CreatePublicationUseCase from '../create-publication-use-case';

describe('Create publication use case', () => {
  let publicationRepository: PublicationRepository;
  let userRepository: UserRepository;
  let characteristicRepository: CharacteristicRepository;
  let useCase: CreatePublicationUseCase;
  let userUseCase: CreateUserUseCase;
  let hashProvider: HashProvider;

  beforeEach(async () => {
    publicationRepository = new PublicationRepositoryMock();
    userRepository = new UserRepositoryMock();
    characteristicRepository = new CharacteristicRepositoryMock();
    hashProvider = new HashProviderMock();
    useCase = new CreatePublicationUseCase(publicationRepository, userRepository, characteristicRepository);
    userUseCase = new CreateUserUseCase(userRepository, hashProvider);
  });
  it('should be able to create a new publication', async () => {
    const userData = {
      name: 'Test name',
      email: 'test@test.com.br',
      password: '1234',
      phoneNumber: '123456789',
    };
    const user = await userUseCase.execute(userData);

    const publicationData = {
      authorId: user.id,
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
      characteristics: await characteristicRepository.findAll(),
    };
    const publication = await useCase.execute(publicationData);
    expect(publication).toBeInstanceOf(Publication);
    expect(publication).toHaveProperty('id');
    expect(publication).toHaveProperty('createdAt');
    expect(publication.author.id).toBe(user.id);
    expect(publication.name).toBe(publicationData.name);
    expect(publication.description).toBe(publicationData.description);
    expect(publication.category).toBe(publicationData.category);
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
