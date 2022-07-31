import Publication from '@/modules/publications/entities/publication';
import CharacteristicRepository from '@/modules/publications/repositories/characteristic-repository';
import CharacteristicRepositoryMock from '@/modules/publications/repositories/mocks/characteristic-repository-mock';
import PublicationRepositoryMock from '@/modules/publications/repositories/mocks/publication-repository-mock';
import PublicationRepository from '@/modules/publications/repositories/publication-repository';
import UserRepositoryMock from '@/modules/users/repositories/mocks/user-repository-mock';
import UserRepository from '@/modules/users/repositories/user-repository';
import CreateUserUseCase from '@/modules/users/use-cases/create-user/create-user-use-case';
import HashProvider from '@/shared/container/providers/hash-provider/hash-provider';
import HashProviderMock from '@/shared/container/providers/hash-provider/mocks/hash-provider-mock';

import CreatePublicationUseCase from '../../create-publication/create-publication-use-case';
import GetPublicationUseCase from '../get-publication-use-case';

describe('Get publication use case', () => {
  let publicationRepository: PublicationRepository;
  let userRepository: UserRepository;
  let characteristicRepository: CharacteristicRepository;
  let useCase: GetPublicationUseCase;
  let publicationUseCase: CreatePublicationUseCase;
  let userUseCase: CreateUserUseCase;
  let hashProvider: HashProvider;

  beforeEach(async () => {
    publicationRepository = new PublicationRepositoryMock();
    userRepository = new UserRepositoryMock();
    characteristicRepository = new CharacteristicRepositoryMock();
    hashProvider = new HashProviderMock();
    useCase = new GetPublicationUseCase(publicationRepository);
    publicationUseCase = new CreatePublicationUseCase(publicationRepository, userRepository, characteristicRepository);
    userUseCase = new CreateUserUseCase(userRepository, hashProvider);
  });

  it('should be able to get a publication not found and return null', async () => {
    const publication = await useCase.execute('randomId');
    expect(publication).toBeNull();
  });

  it('should be able to get a found publication', async () => {
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
      images: [],
    };

    const publicationId = (await publicationUseCase.execute(publicationData)).id;

    const publication = await useCase.execute(publicationId);

    expect(publication).not.toBeNull();
    expect(publication).toBeInstanceOf(Publication);
    expect(publication).toHaveProperty('id');
    expect(publication).toHaveProperty('createdAt');
    expect(publication?.author.id).toEqual(user.id);
    expect(publication?.author.name).toBe(userData.name);
    expect(publication?.author.email).toBe(userData.email);
    expect(publication?.author.phoneNumber).toBe(userData.phoneNumber);
    expect(publication?.name).toEqual(publicationData.name);
    expect(publication?.description).toEqual(publicationData.description);
    expect(publication?.category).toEqual(publicationData.category);
    expect(publication?.gender).toEqual(publicationData.gender);
    expect(publication?.breed).toEqual(publicationData.breed);
    expect(publication?.weightInGrams).toEqual(publicationData.weightInGrams);
    expect(publication?.ageInYears).toEqual(publicationData.ageInYears);
    expect(publication?.zipCode).toEqual(publicationData.zipCode);
    expect(publication?.city).toEqual(publicationData.city);
    expect(publication?.state).toEqual(publicationData.state);
    expect(publication?.isArchived).toEqual(publicationData.isArchived);
    expect(publication?.hidePhoneNumber).toEqual(publicationData.hidePhoneNumber);
    expect(publication?.characteristics).toBe(publicationData.characteristics);
  });
});
