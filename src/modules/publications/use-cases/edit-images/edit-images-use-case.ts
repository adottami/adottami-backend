import { injectable, inject } from 'tsyringe';

import StorageProvider from '@/shared/container/providers/storage-provider/storage-provider';
import ForbiddenHTTPError from '@/shared/infra/http/errors/forbidden-http-error';
import NotFoundHTTPError from '@/shared/infra/http/errors/not-found-http-error';
import UseCaseService from '@/shared/use-cases/use-case-service';

import Image from '../../entities/image';
import Publication from '../../entities/publication';
import PublicationRepository from '../../repositories/publication-repository';

interface EditImagesRequest {
  userId: string;
  publicationId: string;
  newFiles: Express.Multer.File[];
}

@injectable()
class EditImagesUseCase implements UseCaseService<EditImagesRequest, Publication> {
  constructor(
    @inject('PublicationRepository')
    private publicationRepository: PublicationRepository,
    @inject('StorageProvider')
    private storageProvider: StorageProvider,
  ) {}

  async execute({ userId, publicationId, newFiles }: EditImagesRequest): Promise<Publication> {
    const publication = await this.publicationRepository.findById(publicationId);

    if (!publication) {
      throw new NotFoundHTTPError('Publication not found.');
    }
    if (publication.author.id !== userId) {
      throw new ForbiddenHTTPError('Only the author of the publication can edit its images.');
    }

    const storageRemovePromises = publication.images.map((image) => this.storageProvider.remove(image.id));
    await Promise.all(storageRemovePromises);

    const storageSavePromises = newFiles.map((file) => this.storageProvider.save(file.path));
    const storageSaveResults = await Promise.all(storageSavePromises);

    const images = storageSaveResults.map((result) => Image.create({ id: result.id, url: result.url }));
    await this.publicationRepository.updateImages(publicationId, images);

    const updatedPublication = await this.publicationRepository.findById(publicationId);

    if (!updatedPublication) {
      throw new NotFoundHTTPError('Something went wrong: updated publication not found.');
    }

    return updatedPublication;
  }
}

export default EditImagesUseCase;
