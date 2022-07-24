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
import StorageProvider from '@/shared/container/providers/storage-provider/storage-provider';

import CreatePublicationUseCase from '../../create-publication/create-publication-use-case';
import EditImagesUseCase from '../edit-images-use-case';

describe('Edit Images Use Case', () => {
  let userRepository: UserRepository;
  let publicationRepository: PublicationRepository;
  let hashProvider: HashProvider;
  let useCase: EditImagesUseCase;
  let userUseCase: CreateUserUseCase;
  let publicationUseCase: CreatePublicationUseCase;
  let characteristicRepository: CharacteristicRepository;
  let storageProvider: StorageProvider;

  beforeEach(() => {
    hashProvider = new HashProviderMock();
    publicationRepository = new PublicationRepositoryMock();
    characteristicRepository = new CharacteristicRepositoryMock();
    hashProvider = new HashProviderMock();
    userRepository = new UserRepositoryMock();
    publicationUseCase = new CreatePublicationUseCase(publicationRepository, userRepository, characteristicRepository);
    userUseCase = new CreateUserUseCase(userRepository, hashProvider);
    useCase = new EditImagesUseCase(publicationRepository, storageProvider);
  });

  it('should be able to edit images of publication', async () => {
    const userData = {
      name: 'Name of Test',
      email: 'name212@test.com.br',
      password: '1221',
      phoneNumber: '132322453',
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
    const publication = await publicationUseCase.execute(publicationData);
    expect(publication).toBeInstanceOf(Publication);

    useCase.execute({ publicationId: publication.id, newImages: publication.images });
  });
});
