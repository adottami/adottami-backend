import Entity, { EntityProps } from '@/shared/entities/entity';

interface CharacteristicProps extends EntityProps {
  name: string;
}

class Characteristic extends Entity {
  readonly name: string;

  private constructor({ id, name }: CharacteristicProps) {
    super({ id });
    this.name = name;
  }

  static create(characteristicProps: CharacteristicProps) {
    const characteristic = new Characteristic(characteristicProps);

    return characteristic;
  }

  static createMany(characteristicsProps: CharacteristicProps[]): Characteristic[] {
    const characteristics = [];

    for (const characteristicData of characteristicsProps) {
      characteristics.push(this.create(characteristicData));
    }

    return characteristics;
  }

  toJson() {
    const { id, name } = this;

    return {
      id,
      name,
    };
  }
}

export default Characteristic;
