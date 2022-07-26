import { injectable, inject } from 'tsyringe';

import Characteristic from '@/modules/publications/entities/characteristic';
import Publication from '@/modules/publications/entities/publication';
import CharacteristicRepository from '@/modules/publications/repositories/characteristic-repository';
import PublicationRepository from '@/modules/publications/repositories/publication-repository';
import BadRequestHTTPError from '@/shared/infra/http/errors/bad-request-http-error';
import ForbiddenHTTPError from '@/shared/infra/http/errors/forbidden-http-error';
import UseCaseService from '@/shared/use-cases/use-case-service';

interface UpdatePublicationRequest {
  userId: string;
  publicationId: string;
  name?: string;
  description?: string;
  category?: string;
  gender?: string;
  breed?: string | null;
  weightInGrams?: number | null;
  ageInYears?: number | null;
  zipCode?: string;
  city?: string;
  state?: string;
  isArchived?: boolean;
  hidePhoneNumber?: boolean;
  characteristics?: Characteristic[];
}

@injectable()
class UpdatePublicationUseCase implements UseCaseService<UpdatePublicationRequest, Publication | null> {
  constructor(
    @inject('PublicationRepository')
    private publicationRepository: PublicationRepository,

    @inject('CharacteristicRepository')
    private characteristicRepository: CharacteristicRepository,
  ) {}

  async execute({
    userId,
    publicationId,
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
  }: UpdatePublicationRequest): Promise<Publication | null> {
    const publication = await this.publicationRepository.findById(publicationId);

    if (!publication) {
      throw new BadRequestHTTPError('Publication does not exists');
    }

    if (publication.author.id !== userId) {
      throw new ForbiddenHTTPError("User isn't publication author");
    }

    if (characteristics !== undefined) {
      for (let index = 0; index < characteristics.length; index++) {
        const characteristic = characteristics[index];
        const testCharacteristic = await this.characteristicRepository.findById(characteristic.id);

        if (!testCharacteristic) {
          throw new BadRequestHTTPError(`Characteristic with id ${characteristic.id} does not exists`);
        }
      }
    }

    const publicationData = {
      ...publication,
      name: name !== undefined ? name : publication.name,
      description: description !== undefined ? description : publication.description,
      category: category !== undefined ? category : publication.category,
      gender: gender !== undefined ? gender : publication.gender,
      breed: breed !== undefined ? breed : publication.breed,
      weightInGrams: weightInGrams !== undefined ? weightInGrams : publication.weightInGrams,
      ageInYears: ageInYears !== undefined ? ageInYears : publication.ageInYears,
      zipCode: zipCode !== undefined ? zipCode : publication.zipCode,
      city: city !== undefined ? city : publication.city,
      state: state !== undefined ? state : publication.state,
      isArchived: isArchived !== undefined ? isArchived : publication.isArchived,
      hidePhoneNumber: hidePhoneNumber !== undefined ? hidePhoneNumber : publication.hidePhoneNumber,
      characteristics: characteristics !== undefined ? characteristics : publication.characteristics,
    };

    const updatedPublication = await this.publicationRepository.update(
      publicationId,
      Publication.create(publicationData),
    );

    return updatedPublication || null;
  }
}

export default UpdatePublicationUseCase;
