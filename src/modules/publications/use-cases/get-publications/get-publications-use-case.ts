import { inject, injectable } from 'tsyringe';

import Publication from '@/modules/publications/entities/publication';
import PublicationRepository, { OrderBy } from '@/modules/publications/repositories/publication-repository';
import User from '@/modules/users/entities/user';
import UseCaseService from '@/shared/use-cases/use-case-service';

const DEFAULT_IS_ARCHIVED = false;
const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 20;

interface GetPublicationsRequest {
  city?: string;
  ignoreCityCase?: boolean;
  state?: string;
  ignoreStateCase?: boolean;
  categories?: string;
  isArchived?: boolean;
  authorId?: string;
  page?: number;
  perPage?: number;
  orderBy?: OrderBy;
}

@injectable()
class GetPublicationsUseCase implements UseCaseService<GetPublicationsRequest, Publication[]> {
  constructor(
    @inject('PublicationRepository')
    private publicationRepository: PublicationRepository,
  ) {}

  async execute({
    city,
    ignoreCityCase,
    state,
    ignoreStateCase,
    categories,
    isArchived = DEFAULT_IS_ARCHIVED,
    authorId,
    page = DEFAULT_PAGE,
    perPage = DEFAULT_PER_PAGE,
    orderBy,
  }: GetPublicationsRequest): Promise<Publication[]> {
    const basePublications = await this.publicationRepository.findAll({
      city,
      ignoreCityCase,
      state,
      ignoreStateCase,
      categories: categories ? categories.split(',') : undefined,
      isArchived,
      authorId,
      page,
      perPage,
      orderBy,
    });

    const publications = basePublications.map((publication) => {
      if (!publication.hidePhoneNumber) {
        return publication;
      }
      const authorWithHiddenPhoneNumber = User.create({ ...publication.author, phoneNumber: undefined });
      return Publication.create({ ...publication, author: authorWithHiddenPhoneNumber });
    });

    return publications;
  }
}

export default GetPublicationsUseCase;
