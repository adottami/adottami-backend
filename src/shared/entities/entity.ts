import { v4 as uuid } from 'uuid';

export interface EntityProps {
  id?: string;
  createdAt?: Date;
}

abstract class Entity {
  readonly id: string;
  readonly createdAt: Date;

  constructor({ id, createdAt }: EntityProps) {
    this.id = id || uuid();
    this.createdAt = createdAt || new Date();
  }
}

export default Entity;
