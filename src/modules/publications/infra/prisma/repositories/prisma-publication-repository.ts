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
        characteristics: {},
      },
      include: {
        author: true,
        characteristics: true,
      },
    });

    await prisma.characteristicsOnPublications.createMany({
      data: characteristics.map((characteristic) => ({
        characteristicId: characteristic.id,
        publicationId: publication.id,
      })),
    });

    const publicationCharacteristics = await prisma.publication.findUnique({
      where: {
        id: publication.id,
      },
      include: {
        author: true,
        characteristics: {
          include: {
            characteristic: true,
          },
        },
      },
    });

    const author = User.create(publication.author);

    return Publication.create({
      ...publicationCharacteristics,
      author,
      characteristics: Characteristic.createMany(
        publicationCharacteristics.characteristics.map((characteristic) => characteristic.characteristic),
      ),
    });
  }
}

export default PrismaPublicationRepository;
