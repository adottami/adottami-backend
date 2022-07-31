import Publication from '@/modules/publications/entities/publication';

import Image from '../entities/image';

export type OrderBy = 'most-recently-created';

export interface ParametersFindAll {
  city?: string;
  state?: string;
  categories?: string[];
  isArchived?: boolean;
  authorId?: string;
  page?: number;
  perPage: number;
  orderBy?: OrderBy;
}

export interface UpdatePublicationData {
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
  update(id: string, updateData: UpdatePublicationData): Promise<Publication | null>;
  updateImages(id: string, newImages: Image[]): Promise<void>;
  delete(id: string): Promise<void>;
}

export default PublicationRepository;
