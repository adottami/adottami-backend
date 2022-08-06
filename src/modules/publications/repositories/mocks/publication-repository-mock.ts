import Characteristic from '@/modules/publications/entities/characteristic';
import Publication from '@/modules/publications/entities/publication';
import User from '@/modules/users/entities/user';
import NotFoundHTTPError from '@/shared/infra/http/errors/not-found-http-error';

import Image from '../../entities/image';
import PublicationRepository, { FindAllPublicationFilters } from '../publication-repository';

class PublicationRepositoryMock implements PublicationRepository {
  constructor(private publications: Publication[] = []) {}

  async create(
    _authorId: string,
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
      images,
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
      images,
      createdAt,
    });

    this.publications.push(publication);

    return publication;
  }

  findAll({
    city,
    ignoreCityCase,
    state,
    ignoreStateCase,
    categories,
    isArchived,
    authorId,
    page,
    perPage,
    orderBy,
  }: FindAllPublicationFilters): Promise<Publication[]> {
    const publications = this.publications.filter((publication) => {
      const isIncludedInFilteredCity =
        !city ||
        (ignoreCityCase
          ? publication.city.toLowerCase().includes(city.toLowerCase())
          : publication.city.includes(city));
      const isIncludedInFilteredState =
        !state ||
        (ignoreStateCase
          ? publication.state.toLowerCase().includes(state.toLowerCase())
          : publication.state.includes(state));
      const isIncludedInFilteredCategory = !categories || categories.includes(publication.category);
      const isIncludedInFilteredArchiveStatus = publication.isArchived === isArchived;
      const isIncludedInFilteredAuthor = !authorId || publication.author.id === authorId;

      return (
        isIncludedInFilteredCity &&
        isIncludedInFilteredState &&
        isIncludedInFilteredCategory &&
        isIncludedInFilteredArchiveStatus &&
        isIncludedInFilteredAuthor
      );
    });

    const publicationsOrderByAndPage = publications
      .sort((publication, otherPublication) => {
        if (orderBy === 'most-recently-created') {
          return otherPublication.createdAt.getTime() - publication.createdAt.getTime();
        }
        return 0;
      })
      .slice(((page || 1) - 1) * perPage, (page || 1) * perPage)
      .map((publication) => {
        return Publication.create({
          ...publication,
          author: User.create(publication.author),
          characteristics: Characteristic.createMany(publication.characteristics),
        });
      });

    return Promise.resolve(publicationsOrderByAndPage);
  }

  async findById(id: string): Promise<Publication | null> {
    const publication = this.publications.find((publication) => publication.id === id);

    return publication || null;
  }

  async update(id: string, publication: Publication): Promise<Publication> {
    const publicationIndex = this.publications.findIndex((publication) => publication.id === id);

    if (publicationIndex === -1) {
      throw new NotFoundHTTPError('Publication not found');
    }

    this.publications[publicationIndex] = Publication.create(publication);

    return this.publications[publicationIndex];
  }

  async updateImages(id: string, newImages: Image[]): Promise<void> {
    const publicationIndex = this.publications.findIndex((publication) => publication.id === id);

    const newPublication = Publication.create({ ...this.publications[publicationIndex], images: newImages });

    this.publications[publicationIndex] = newPublication;
  }

  async delete(id: string): Promise<void> {
    this.publications = this.publications.filter((publication) => publication.id !== id);
  }
}

export default PublicationRepositoryMock;
