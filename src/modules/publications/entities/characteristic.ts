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
    const characteristics = characteristicsProps.map((characteristicProps) =>
      Characteristic.create(characteristicProps),
    );

    return characteristics;
  }

  toJson() {
    const { id, name } = this;

    return {
      id,
      name,
    };
  }

  static manyToJson(characteristics: Characteristic[]) {
    return characteristics.map((characteristic) => characteristic.toJson());
  }
}

export default Characteristic;
