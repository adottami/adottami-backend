import { v4 as uuid } from 'uuid';

abstract class Entity {
  readonly id?: string;
  readonly createdAt?: Date;

  constructor({ id, createdAt }: Entity) {
    this.id = id || uuid();
    this.createdAt = createdAt || new Date();
  }
}

export default Entity;
