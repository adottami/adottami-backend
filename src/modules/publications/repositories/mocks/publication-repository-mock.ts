import Publication from '@/modules/publications/entities/publication';
import User from '@/modules/users/entities/user';

import PublicationRepository, { ParametersFindAll } from '../publication-repository';

class PublicationRepositoryMock implements PublicationRepository {
  constructor(private publications: Publication[] = []) {}

  async create(
    authorId: string,
    {
      author,
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
      createdAt,
    }: Publication,
  ): Promise<Publication> {
    const publication = Publication.create({
      author,
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
      createdAt,
    });

    this.publications.push(publication);

    return publication;
  }

  findAll({
    city,
    state,
    categories,
    isArchived,
    authorId,
    page,
    perPage,
    orderBy,
  }: ParametersFindAll): Promise<Publication[]> {
    const publications = this.publications.filter(
      (publication) =>
        (!city || publication.city === city) &&
        (!state || publication.state === state) &&
        (!categories || categories.split(',').includes(publication.category)) &&
        publication.isArchived === isArchived &&
        (!authorId || publication.author.id === authorId),
    );

    const publicationsOrderByAndPage = publications
      .sort((a, b) => {
        if (orderBy === 'createdAt') {
          return a.createdAt.getTime() - b.createdAt.getTime();
        }
        if (orderBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        return 0;
      })
      .slice(((page || 1) - 1) * perPage, (page || 1) * perPage)
      .map((publication) => {
        if (publication.hidePhoneNumber) {
          return Publication.create({
            ...publication,
            author: User.create({ ...publication.author, phoneNumber: '' }),
          });
        }
        return publication;
      });

    return Promise.resolve(publicationsOrderByAndPage);
  }
}

export default PublicationRepositoryMock;
