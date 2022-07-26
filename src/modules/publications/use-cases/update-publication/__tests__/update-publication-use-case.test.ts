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
import BadRequestHTTPError from '@/shared/infra/http/errors/bad-request-http-error';
import ForbiddenHTTPError from '@/shared/infra/http/errors/forbidden-http-error';

import CreatePublicationUseCase from '../../create-publication/create-publication-use-case';
import UpdatePublicationUseCase from '../update-publication-use-case';

describe('Update publication use case', () => {
  let publicationRepository: PublicationRepository;
  let userRepository: UserRepository;
  let characteristicRepository: CharacteristicRepository;
  let useCase: UpdatePublicationUseCase;
  let userUseCase: CreateUserUseCase;
  let createPubUseCase: CreatePublicationUseCase;
  let hashProvider: HashProvider;

  beforeEach(async () => {
    publicationRepository = new PublicationRepositoryMock();
    userRepository = new UserRepositoryMock();
    characteristicRepository = new CharacteristicRepositoryMock();
    hashProvider = new HashProviderMock();
    useCase = new UpdatePublicationUseCase(publicationRepository, characteristicRepository);
    createPubUseCase = new CreatePublicationUseCase(publicationRepository, userRepository, characteristicRepository);
    userUseCase = new CreateUserUseCase(userRepository, hashProvider);
  });

  it('should be able to update a publication', async () => {
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
    const publication = await createPubUseCase.execute(publicationData);

    const updateData = {
      userId: user.id,
      publicationId: publication.id,
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

    const updatePublication = await useCase.execute(updateData);

    expect(updatePublication).toBeInstanceOf(Publication);
    expect(updatePublication).toHaveProperty('id');
    expect(updatePublication.id).toBe(publication.id);
    expect(updatePublication).toHaveProperty('createdAt');
    expect(updatePublication.author.id).toBe(publication.author.id);
    expect(updatePublication.name).not.toBe(publication.name);
    expect(updatePublication.description).toBe(publication.description);
    expect(updatePublication.category).toBe(publication.category);
    expect(updatePublication.gender).not.toBe(publication.gender);
    expect(updatePublication.breed).toBe(publication.breed);
    expect(updatePublication.weightInGrams).toBe(publication.weightInGrams);
    expect(updatePublication.ageInYears).not.toBe(publication.ageInYears);
    expect(updatePublication.zipCode).not.toBe(publication.zipCode);
    expect(updatePublication.city).toBe(publication.city);
    expect(updatePublication.state).toBe(publication.state);
    expect(updatePublication.isArchived).not.toBe(publication.isArchived);
    expect(updatePublication.hidePhoneNumber).toBe(publication.hidePhoneNumber);
    expect(updatePublication.characteristics).toEqual(publication.characteristics);
  });

  it('should not be able to update a uncreated publication', async () => {
    const userData = {
      name: 'Test name',
      email: 'test@test.com.br',
      password: '1234',
      phoneNumber: '123456789',
    };
    const user = await userUseCase.execute(userData);

    const updateData = {
      userId: user.id,
      publicationId: 'randomId',
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

    await expect(useCase.execute(updateData)).rejects.toEqual(new BadRequestHTTPError('Publication does not exists'));
  });

  it('should not be able to update a publication of another user', async () => {
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
    const publication = await createPubUseCase.execute(publicationData);

    const updateData = {
      userId: 'randomId',
      publicationId: publication.id,
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

    await expect(useCase.execute(updateData)).rejects.toEqual(new ForbiddenHTTPError("User isn't publication author"));
  });
});
