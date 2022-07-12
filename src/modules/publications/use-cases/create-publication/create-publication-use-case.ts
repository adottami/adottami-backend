import { injectable, inject } from 'tsyringe';

import Publication from '@/modules/publications/entities/publication';
import PublicationRepository from '@/modules/repositories/publication-repository';
import UserRepository from '@/modules/users/repositories/user-repository';
import BadRequestHTTPError from '@/shared/infra/http/errors/bad-request-http-error';
import UseCaseService from '@/shared/use-cases/use-case-service';

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
  characteristics: Array<{ id: string }>;
}

@injectable()
class CreatePublicationUseCase implements UseCaseService<CreatePublicationRequest, Publication> {
  constructor(
    @inject('PublicationRepository')
    private publicationRepository: PublicationRepository,

    @inject('UserRepository')
    private userRepository: UserRepository,
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
  }: CreatePublicationRequest): Promise<Publication> {
    const author = await this.userRepository.findById(authorId);

    if (!author) {
      throw new BadRequestHTTPError('User does not exists');
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
    });

    const publication = await this.publicationRepository.create(authorId, publicationData);

    return publication;
  }
}

export default CreatePublicationUseCase;
