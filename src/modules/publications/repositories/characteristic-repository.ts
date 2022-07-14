import Characteristic from '../entities/characteristic';

interface CharacteristicRepository {
  findAll(): Promise<Characteristic[]>;
  findById(id: string): Promise<Characteristic | null>;
}

export default CharacteristicRepository;
