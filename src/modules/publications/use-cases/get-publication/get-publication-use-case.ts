import { injectable, inject } from 'tsyringe';

import Publication from '@/modules/publications/entities/publication';
import PublicationRepository from '@/modules/publications/repositories/publication-repository';
import UseCaseService from '@/shared/use-cases/use-case-service';

@injectable()
class GetPublicationUseCase implements UseCaseService<string, Publication | null> {
  constructor(
    @inject('PublicationRepository')
    private publicationRepository: PublicationRepository,
  ) {}

  async execute(id: string): Promise<Publication | null> {
    const publication = await this.publicationRepository.findById(id);

    return publication;
  }
}

export default GetPublicationUseCase;
