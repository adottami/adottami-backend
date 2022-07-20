import Publication from '@/modules/publications/entities/publication';

import PublicationRepository from '../publication-repository';

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
    });

    this.publications.push(publication);

    return publication;
  }

  async findById(id: string): Promise<Publication | null> {
    const publication = this.publications.find((publication) => publication.id === id);

    return publication || null;
  }
}

export default PublicationRepositoryMock;
