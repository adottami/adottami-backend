import Entity, { EntityProps } from '@/shared/entities/entity';

interface CharacteristicProps extends EntityProps {
  name: string;
  publicationId: string;
}

class Characteristic extends Entity {
  readonly name: string;
  readonly publicationId: string;

  private constructor({ id, name, publicationId, createdAt }: CharacteristicProps) {
    super({ id, createdAt });
    this.name = name;
    this.publicationId = publicationId;
  }

  static create(characteristicProps: CharacteristicProps) {
    const characteristic = new Characteristic(characteristicProps);

    return characteristic;
  }

  toJson() {
    const { id, name, createdAt } = this;

    return {
      id,
      name,
      createdAt,
    };
  }
}

export default Characteristic;
