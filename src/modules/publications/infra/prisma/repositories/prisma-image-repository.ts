import Image from '@/modules/publications/entities/image';
import ImageRepository from '@/modules/publications/repositories/image-repository';
import prisma from '@/shared/infra/prisma/prisma-client';

class PrismaImageRepository implements ImageRepository {
  async findById(id: string): Promise<Image | null> {
    const image = await prisma.image.findUnique({
      where: { id },
    });

    return image ? Image.create(image) : null;
  }
}

export default PrismaImageRepository;
