import { inject, injectable } from 'tsyringe';

import BadRequestHTTPError from '@/shared/infra/http/errors/bad-request-http-error';
import ForbiddenHTTPError from '@/shared/infra/http/errors/forbidden-http-error';
import UseCaseService from '@/shared/use-cases/use-case-service';

import PublicationRepository from '../../repositories/publication-repository';

interface RemovePublicationRequest {
  userId: string;
  publicationId: string;
}

@injectable()
class RemovePublicationUseCase implements UseCaseService<RemovePublicationRequest, void> {
  constructor(
    @inject('PublicationRepository')
    private publicationRepository: PublicationRepository,
  ) {}

  async execute({ userId, publicationId }: RemovePublicationRequest): Promise<void> {
    const publication = await this.publicationRepository.findById(publicationId);

    if (!publication) {
      throw new BadRequestHTTPError('Publication not found');
    }

    if (publication.author.id !== userId) {
      throw new ForbiddenHTTPError('Only the author of the publication can remove it.');
    }

    await this.publicationRepository.delete(publicationId);
  }
}

export default RemovePublicationUseCase;
