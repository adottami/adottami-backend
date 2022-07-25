import Publication from '@/modules/publications/entities/publication';

import Image from '../entities/image';

export interface ParametersFindAll {
  city: string;
  state: string;
  categories?: string[];
  isArchived?: boolean;
  authorId?: string;
  page?: number;
  perPage: number;
  orderBy?: string;
}

interface PublicationRepository {
  create(authorId: string, publication: Publication): Promise<Publication>;
  findAll(parameters: ParametersFindAll): Promise<Publication[]>;
  findById(id: string): Promise<Publication | null>;
  updateImages(id: string, newImages: Image[]): Promise<void>;
}

export default PublicationRepository;
