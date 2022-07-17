import Characteristic from '@/modules/publications/entities/characteristic';
import Publication from '@/modules/publications/entities/publication';
import PublicationRepository, { ParametersFindAll } from '@/modules/publications/repositories/publication-repository';
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

  async findAll({
    city,
    state,
    categories,
    isArchived,
    authorId,
    page,
    perPage,
    orderBy,
  }: ParametersFindAll): Promise<Publication[]> {
    const allPublications = await prisma.publication.findMany({
      take: perPage,
      skip: page ? perPage * (page - 1) : 0,
      where: {
        city: { equals: city },
        state: { equals: state },
        category: categories ? { in: categories.split(',') } : undefined,
        isArchived: isArchived ? { equals: isArchived } : false,
        authorId: authorId ? { equals: authorId } : undefined,
      },
      orderBy: orderBy ? [{ [orderBy]: 'asc' }] : undefined,
      include: {
        author: true,
        characteristics: true,
      },
    });

    const publications = allPublications.map((publication) => {
      return {
        ...publication,
        author: User.create({
          ...publication.author,
          phoneNumber: publication.hidePhoneNumber ? '' : publication.author.phoneNumber,
        }),
        characteristics: Characteristic.createMany(publication.characteristics),
      };
    });

    return Publication.createMany(publications);
  }
}

export default PrismaPublicationRepository;
