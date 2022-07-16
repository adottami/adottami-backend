import Publication from '@/modules/publications/entities/publication';

interface PublicationRepository {
  create(authorId: string, publication: Publication): Promise<Publication>;
  findById(id: string): Promise<Publication | null>;
}

export default PublicationRepository;
