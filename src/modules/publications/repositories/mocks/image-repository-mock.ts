import Image from '../../entities/image';
import ImageRepository from '../image-repository';

class ImageRepositoryMock implements ImageRepository {
  constructor(private images: Image[] = []) {}

  async findById(id: string): Promise<Image | null> {
    const image = this.images.find((image) => image.id === id);

    return image || null;
  }
}

export default ImageRepositoryMock;
