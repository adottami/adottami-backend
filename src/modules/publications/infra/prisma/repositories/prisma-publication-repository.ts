import Characteristic from '@/modules/publications/entities/characteristic';
import Image from '@/modules/publications/entities/image';
import Publication from '@/modules/publications/entities/publication';
import PublicationRepository, {
  ParametersFindAll,
  UpdatePublicationData,
} from '@/modules/publications/repositories/publication-repository';
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
      images,
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
        images: {
          createMany: { data: images.map((image) => ({ id: image.id, url: image.url })) },
        },
      },
      include: {
        author: true,
        characteristics: true,
        images: true,
      },
    });

    const author = User.create(publication.author);
    const publicationCharacteristics = Characteristic.createMany(publication.characteristics);
    const imagesPublication = Image.createMany(publication.images);

    return Publication.create({
      ...publication,
      author,
      characteristics: publicationCharacteristics,
      images: imagesPublication,
    });
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
        city: city ? { equals: city } : undefined,
        state: state ? { equals: state } : undefined,
        category: categories ? { in: categories } : undefined,
        isArchived: typeof isArchived !== undefined ? { equals: isArchived } : undefined,
        authorId: authorId ? { equals: authorId } : undefined,
      },
      orderBy: orderBy ? [{ [orderBy]: 'asc' }] : undefined,
      include: {
        author: true,
        characteristics: true,
        images: true,
      },
    });

    const publications = allPublications.map((publication) => {
      return {
        ...publication,
        author: User.create(publication.author),
        characteristics: Characteristic.createMany(publication.characteristics),
        images: Image.createMany(publication.images),
      };
    });

    return Publication.createMany(publications);
  }

  async findById(id: string): Promise<Publication | null> {
    const publication = await prisma.publication.findUnique({
      where: { id },
      include: {
        author: true,
        characteristics: true,
        images: true,
      },
    });

    if (publication === null) {
      return null;
    }

    const author = User.create(publication.author);
    const publicationCharacteristics = Characteristic.createMany(publication.characteristics);
    const publicationImages = Image.createMany(publication.images);

    return Publication.create({
      ...publication,
      author,
      characteristics: publicationCharacteristics,
      images: publicationImages,
    });
  }

  async updateImages(publicationId: string, newImages: Image[]): Promise<void> {
    await prisma.image.deleteMany({ where: { publicationId } });

    await prisma.image.createMany({
      data: newImages.map((image) => ({ id: image.id, url: image.url, publicationId })),
    });
  }

  async update(
    id: string,
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
    }: UpdatePublicationData,
  ): Promise<Publication | null> {
    await prisma.publication.update({
      where: { id },
      data: {
        name: name !== undefined ? name : undefined,
        description: description !== undefined ? description : undefined,
        category: category !== undefined ? category : undefined,
        gender: gender !== undefined ? gender : undefined,
        breed: breed !== undefined ? breed : undefined,
        weightInGrams: weightInGrams !== undefined ? weightInGrams : undefined,
        ageInYears: ageInYears !== undefined ? ageInYears : undefined,
        zipCode: zipCode !== undefined ? zipCode : undefined,
        city: city !== undefined ? city : undefined,
        state: state !== undefined ? state : undefined,
        isArchived: isArchived !== undefined ? isArchived : undefined,
        hidePhoneNumber: hidePhoneNumber !== undefined ? hidePhoneNumber : undefined,
        characteristics: characteristics !== undefined ? { set: characteristics } : undefined,
      },
    });

    const updatedPublication = await this.findById(id);

    return updatedPublication;
  }
}

export default PrismaPublicationRepository;
