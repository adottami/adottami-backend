import Characteristic from '@/modules/publications/entities/characteristic';
import Publication from '@/modules/publications/entities/publication';
import PublicationRepository from '@/modules/repositories/publication-repository';
import User from '@/modules/users/entities/user';
import prisma from '@/shared/infra/prisma/prisma-client';

class PrismaPublicationRepository implements PublicationRepository {
  async create(
    authorId: string,
    {
      name,
      description,
      category,
      gender,
      breed,
      weightInGrams,
      ageInYears,
      zipCode,
      city,
      state,
      isArchived,
      hidePhoneNumber,
      characteristics,
    }: Publication,
  ): Promise<Publication> {
    const publication = await prisma.publication.create({
      data: {
        author: { connect: { id: authorId } },
        name,
        description,
        category,
        gender,
        breed,
        weightInGrams,
        ageInYears,
        zipCode,
        city,
        state,
        isArchived,
        hidePhoneNumber,
        characteristics: {
          connect: characteristics,
        },
      },
      include: {
        author: true,
        characteristics: true,
      },
    });

    const author = User.create(publication.author);
    const publicationCharacteristics = Characteristic.createMany(publication.characteristics);

    return Publication.create({ ...publication, author, characteristics: publicationCharacteristics });
  }
}

export default PrismaPublicationRepository;
