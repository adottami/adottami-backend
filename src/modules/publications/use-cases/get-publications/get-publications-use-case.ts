import { inject, injectable } from 'tsyringe';

import Publication from '@/modules/publications/entities/publication';
import PublicationRepository from '@/modules/publications/repositories/publication-repository';
import User from '@/modules/users/entities/user';
import UseCaseService from '@/shared/use-cases/use-case-service';

interface GetPublicationsRequest {
  city: string;
  state: string;
  categories?: string;
  isArchived?: boolean;
  authorId?: string;
  page?: number;
  perPage: number;
  orderBy?: string;
}

@injectable()
class GetPublicationsUseCase implements UseCaseService<GetPublicationsRequest, Publication[]> {
  constructor(
    @inject('PublicationRepository')
    private publicationRepository: PublicationRepository,
  ) {}

  async execute({
    city,
    state,
    categories,
    isArchived,
    authorId,
    page,
    perPage,
    orderBy,
  }: GetPublicationsRequest): Promise<Publication[]> {
    const isArchivedDefault = false;
    const pageDefault = 1;
    const perPageDefault = 20;

    const publications = await this.publicationRepository.findAll({
      city,
      state,
      categories: categories ? categories.split(',') : undefined,
      isArchived: typeof isArchived !== undefined ? isArchived : isArchivedDefault,
      authorId,
      page: page || pageDefault,
      perPage: perPage || perPageDefault,
      orderBy,
    });

    const changedPublications = publications.map((publication) => {
      if (publication.hidePhoneNumber) {
        return Publication.create({
          ...publication,
          author: User.create({ ...publication.author, phoneNumber: undefined }),
        });
      }
      return publication;
    });

    return changedPublications;
  }
}

export default GetPublicationsUseCase;
