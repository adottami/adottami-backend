import { injectable, inject } from 'tsyringe';

import StorageProvider from '@/shared/container/providers/storage-provider/storage-provider';
import UseCaseService from '@/shared/use-cases/use-case-service';

import Image from '../../entities/image';
import Publication from '../../entities/publication';
import PublicationRepository from '../../repositories/publication-repository';

interface EditImagesRequest {
  publicationId: string;
  newImages: Image[];
}

@injectable()
class EditImagesUseCase implements UseCaseService<EditImagesRequest, Publication | null> {
  constructor(
    @inject('PublicationRepository')
    private publicationRepository: PublicationRepository,
    @inject('StorageProvider')
    private storageProvider: StorageProvider,
  ) {}

  async execute({ publicationId }: EditImagesRequest): Promise<Publication | null> {
    const publication = await this.publicationRepository.findById(publicationId);

    if (!publication) {
      return null;
    }

    const removePromises = publication.images.map((image) => this.storageProvider.remove(image.url));
    await Promise.all(removePromises);

    const savePromises = publication?.images.map((image) => this.storageProvider.save(image.url));

    const saveResults = await Promise.all(savePromises);

    const images = saveResults.map((result) => Image.create({ id: result.id, url: result.url }));

    await this.publicationRepository.updateImages(publicationId, images);

    const updatedPublication = await this.publicationRepository.findById(publicationId);

    return updatedPublication;
  }
}

export default EditImagesUseCase;
