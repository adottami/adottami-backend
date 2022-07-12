import Characteristic from '../../entities/characteristic';
import CharacteristicRepository from '../characteristic-repository';

class CharacteristicRepositoryMock implements CharacteristicRepository {
  constructor(private characteristics: Characteristic[] = []) {
    this.characteristics = this.seed();
  }

  async findAll(): Promise<Characteristic[]> {
    return this.characteristics;
  }

  async findById(id: string): Promise<Characteristic | null> {
    const characteristic = this.characteristics.find((characteristic) => characteristic.id === id);

    return characteristic || null;
  }

  private seed(): Characteristic[] {
    return Characteristic.createMany([
      { id: '1', name: 'Brincalhão' },
      { id: '2', name: 'Dócil' },
      { id: '3', name: 'Calmo' },
      { id: '4', name: 'Sociável' },
      { id: '5', name: 'Sociável com crianças' },
      { id: '6', name: 'Castrado' },
      { id: '7', name: 'Vacinado' },
      { id: '8', name: 'Vermifugado' },
      { id: '9', name: 'Vive bem em apartamento' },
      { id: '10', name: 'Vive bem em casa com quintal' },
    ]);
  }
}

export default CharacteristicRepositoryMock;
