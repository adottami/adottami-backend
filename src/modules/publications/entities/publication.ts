import Characteristic from '@/modules/publications/entities/characteristic';
import User from '@/modules/users/entities/user';
import Entity, { EntityProps } from '@/shared/entities/entity';

interface PublicationProps extends EntityProps {
  author: User;
  name: string;
  description: string;
  category: string;
  gender: string;
  breed: string | null;
  weightInGrams: number | null;
  ageInYears: number | null;
  zipCode: string;
  city: string;
  state: string;
  isArchived: boolean;
  hidePhoneNumber: boolean;
  characteristics: Characteristic[];
}

class Publication extends Entity {
  readonly author: User;
  readonly name: string;
  readonly description: string;
  readonly category: string;
  readonly gender: string;
  readonly breed: string | null;
  readonly weightInGrams: number | null;
  readonly ageInYears: number | null;
  readonly zipCode: string;
  readonly city: string;
  readonly state: string;
  readonly isArchived: boolean;
  readonly hidePhoneNumber: boolean;
  readonly characteristics: Characteristic[];

  private constructor({
    id,
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
  }: PublicationProps) {
    super({ id, createdAt });
    this.author = author;
    this.name = name;
    this.description = description;
    this.category = category;
    this.gender = gender;
    this.breed = breed;
    this.weightInGrams = weightInGrams;
    this.ageInYears = ageInYears;
    this.zipCode = zipCode;
    this.city = city;
    this.state = state;
    this.isArchived = isArchived;
    this.hidePhoneNumber = hidePhoneNumber;
    this.characteristics = characteristics;
  }

  static create(publicationProps: PublicationProps) {
    const publication = new Publication(publicationProps);

    return publication;
  }

  toJson() {
    const {
      id,
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
    } = this;

    return {
      id,
      author: author.toJson(),
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
      characteristics: characteristics.map((characteristic) => characteristic.toJson()),
      createdAt,
    };
  }
}

export default Publication;
