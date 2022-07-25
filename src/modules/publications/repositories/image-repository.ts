import Image from '../entities/image';

interface ImageRepository {
  findById(id: string): Promise<Image | null>;
}

export default ImageRepository;
