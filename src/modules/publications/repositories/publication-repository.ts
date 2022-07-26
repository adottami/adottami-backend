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

export interface UpdatePublication {
  name?: string;
  description?: string;
  category?: string;
  gender?: string;
  breed?: string | null;
  weightInGrams?: number | null;
  ageInYears?: number | null;
  zipCode?: string;
  city?: string;
  state?: string;
  isArchived?: boolean;
  hidePhoneNumber?: boolean;
  characteristics?: Array<{ id: string }>;
}

interface PublicationRepository {
  create(authorId: string, publication: Publication): Promise<Publication>;
  findAll(parameters: ParametersFindAll): Promise<Publication[]>;
  findById(id: string): Promise<Publication | null>;
  update(id: string, updateData: UpdatePublication): Promise<Publication | null>;
  updateImages(id: string, newImages: Image[]): Promise<void>;
}

export default PublicationRepository;
