import { inject, injectable } from 'tsyringe';

import Publication from '@/modules/publications/entities/publication';
import PublicationRepository from '@/modules/publications/repositories/publication-repository';
import UseCaseService from '@/shared/use-cases/use-case-service';

interface GetPublicationsRequest {
  city: string;
  state: string;
  categories?: string; // zero ou mais categorias separadas por vírgula
  isArchived?: boolean; // default: false
  authorId?: string;
  page?: number; // default: 1
  perPage: number; // default: 20
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
    const publications = await this.publicationRepository.findAll({
      city,
      state,
      categories,
      isArchived,
      authorId,
      page,
      perPage,
      orderBy,
    });

    return publications;
  }
}

export default GetPublicationsUseCase;
