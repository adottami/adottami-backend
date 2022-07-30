import { inject, injectable } from 'tsyringe';

import StorageProvider from '@/shared/container/providers/storage-provider/storage-provider';
import BadRequestHTTPError from '@/shared/infra/http/errors/bad-request-http-error';
import ForbiddenHTTPError from '@/shared/infra/http/errors/forbidden-http-error';
import UseCaseService from '@/shared/use-cases/use-case-service';

import PublicationRepository from '../../repositories/publication-repository';

interface RemovePublicationRequest {
  userId: string;
  id: string;
}

@injectable()
class RemovePublicationUseCase implements UseCaseService<RemovePublicationRequest, void> {
  constructor(
    @inject('PublicationRepository')
    private publicationRepository: PublicationRepository,
    @inject('StorageProvider')
    private storageProvider: StorageProvider,
  ) {}

  async execute({ userId, id }: RemovePublicationRequest): Promise<void> {
    const publication = await this.publicationRepository.findById(id);

    if (!publication) {
      throw new BadRequestHTTPError('Publication not found');
    }

    if (publication.author.id !== userId) {
      throw new ForbiddenHTTPError('Only the author of the publication can remove it.');
    }

    const storageRemovePromises = publication.images.map((image) => this.storageProvider.remove(image.id));
    await Promise.all(storageRemovePromises);

    await this.publicationRepository.delete(id);
  }
}

export default RemovePublicationUseCase;
