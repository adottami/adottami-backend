import { injectable, inject } from 'tsyringe';

import PublicationRepository from '@/modules/repositories/publication-repository';
import CloudinaryStorageProvider from '@/shared/container/providers/storage-provider/implementations/cloudinary-storage-provider/cloudinary-storage-provider';
import UseCaseService from '@/shared/use-cases/use-case-service';

import Image from '../../entities/image';
import Publication from '../../entities/publication';
// import ImageRepository from '../../repositories/image-repository';

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
    private storageProvider: CloudinaryStorageProvider,
  ) {}

  async execute({ publicationId }: EditImagesRequest): Promise<Publication | null> {
    const publication = await this.publicationRepository.findById(publicationId);

    if (publication) {
      const removePromises = publication.images.map((image) => this.storageProvider.remove(image.url));

      await Promise.all(removePromises);
    }
    // publication?.images = newImages;

    // const savePromises = publication?.images.map((image) => this.storageProvider.save(image.url));

    // await Promise.all(savePromises);

    return publication;
  }
}

export default EditImagesUseCase;
