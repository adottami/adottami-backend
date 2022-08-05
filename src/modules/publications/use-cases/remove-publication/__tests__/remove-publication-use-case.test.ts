import Publication from '@/modules/publications/entities/publication';
import CharacteristicRepository from '@/modules/publications/repositories/characteristic-repository';
import ImageRepository from '@/modules/publications/repositories/image-repository';
import CharacteristicRepositoryMock from '@/modules/publications/repositories/mocks/characteristic-repository-mock';
import ImageRepositoryMock from '@/modules/publications/repositories/mocks/image-repository-mock';
import PublicationRepositoryMock from '@/modules/publications/repositories/mocks/publication-repository-mock';
import PublicationRepository from '@/modules/publications/repositories/publication-repository';
import UserRepositoryMock from '@/modules/users/repositories/mocks/user-repository-mock';
import UserRepository from '@/modules/users/repositories/user-repository';
import CreateUserUseCase from '@/modules/users/use-cases/create-user/create-user-use-case';
import HashProvider from '@/shared/container/providers/hash-provider/hash-provider';
import HashProviderMock from '@/shared/container/providers/hash-provider/mocks/hash-provider-mock';
import LocalStorageProvider from '@/shared/container/providers/storage-provider/implementations/local-storage-provider/local-storage-provider';
import StorageProvider from '@/shared/container/providers/storage-provider/storage-provider';

import CreatePublicationUseCase from '../../create-publication/create-publication-use-case';
import { saveSampleImageToFileSystem } from '../../edit-images/__tests__/utils';
import EditImagesUseCase from '../../edit-images/edit-images-use-case';
import RemovePublicationUseCase from '../remove-publication-use-case';

describe('Remove Publication Use Case', () => {
  let userRepository: UserRepository;
  let publicationRepository: PublicationRepository;
  let imageRepository: ImageRepository;
  let hashProvider: HashProvider;
  let useCase: RemovePublicationUseCase;
  let editImagesUseCase: EditImagesUseCase;
  let userUseCase: CreateUserUseCase;
  let publicationUseCase: CreatePublicationUseCase;
  let characteristicRepository: CharacteristicRepository;
  let storageProvider: StorageProvider;

  beforeEach(() => {
    hashProvider = new HashProviderMock();
    storageProvider = new LocalStorageProvider();
    publicationRepository = new PublicationRepositoryMock();
    imageRepository = new ImageRepositoryMock();
    characteristicRepository = new CharacteristicRepositoryMock();
    hashProvider = new HashProviderMock();
    userRepository = new UserRepositoryMock();
    publicationUseCase = new CreatePublicationUseCase(publicationRepository, userRepository, characteristicRepository);
    userUseCase = new CreateUserUseCase(userRepository, hashProvider);
    editImagesUseCase = new EditImagesUseCase(publicationRepository, storageProvider);
    useCase = new RemovePublicationUseCase(publicationRepository, storageProvider);
  });

  it('should be able to remove a publication', async () => {
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

    const imageFilePath = await saveSampleImageToFileSystem();

    const updatedPublication = await editImagesUseCase.execute({
      userId: user.id,
      publicationId: publication.id,
      newFiles: [{ path: imageFilePath }] as Express.Multer.File[],
    });
    const image = updatedPublication.images.at(0);

    if (image) {
      await useCase.execute({
        userId: user.id,
        id: updatedPublication.id,
      });
      expect(await publicationRepository.findById(publication.id)).toBeNull();
      expect(await imageRepository.findById(image.id)).toBeNull();
    }
  });
});
