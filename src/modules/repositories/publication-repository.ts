import Publication from '@/modules/publications/entities/publication';

interface PublicationRepository {
  create(authorId: string, publication: Publication): Promise<Publication>;
}

export default PublicationRepository;
