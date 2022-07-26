import { injectable, inject } from 'tsyringe';

import Characteristic from '@/modules/publications/entities/characteristic';
import Publication from '@/modules/publications/entities/publication';
import CharacteristicRepository from '@/modules/publications/repositories/characteristic-repository';
import PublicationRepository from '@/modules/publications/repositories/publication-repository';
import UserRepository from '@/modules/users/repositories/user-repository';
import BadRequestHTTPError from '@/shared/infra/http/errors/bad-request-http-error';
import UseCaseService from '@/shared/use-cases/use-case-service';

import Image from '../../entities/image';

interface CreatePublicationRequest {
  authorId: string;
  name: string;
  description: string;
  category: string;
  gender: string;
  breed: string | null;
  weightInGrams: number | null;
  ageInYears: number | null;
  zipCode: string;
  city: string;
  state: string;
  isArchived: boolean;
  hidePhoneNumber: boolean;
  characteristics: Characteristic[];
  images: Image[];
}

@injectable()
class CreatePublicationUseCase implements UseCaseService<CreatePublicationRequest, Publication> {
  constructor(
    @inject('PublicationRepository')
    private publicationRepository: PublicationRepository,

    @inject('UserRepository')
    private userRepository: UserRepository,

    @inject('CharacteristicRepository')
    private characteristicRepository: CharacteristicRepository,
  ) {}

  async execute({
    authorId,
    name,
    description,
    category,
    gender,
    breed,
    weightInGrams,
    ageInYears,
    zipCode,
    city,
    state,
    isArchived,
    hidePhoneNumber,
    characteristics,
    images,
  }: CreatePublicationRequest): Promise<Publication> {
    const author = await this.userRepository.findById(authorId);

    if (!author) {
      throw new BadRequestHTTPError('Author does not exists');
    }

    for (let index = 0; index < characteristics.length; index++) {
      const characteristic = characteristics[index];
      const testCharacteristic = await this.characteristicRepository.findById(characteristic.id);

      if (!testCharacteristic) {
        throw new BadRequestHTTPError(`Characteristic with id ${characteristic.id} does not exists`);
      }
    }

    const publicationData = Publication.create({
      author,
      name,
      description,
      category,
      gender,
      breed,
      weightInGrams,
      ageInYears,
      zipCode,
      city,
      state,
      isArchived,
      hidePhoneNumber,
      characteristics,
      images,
    });

    const publication = await this.publicationRepository.create(authorId, publicationData);

    return publication;
  }
}

export default CreatePublicationUseCase;
