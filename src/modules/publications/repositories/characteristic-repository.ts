import Characteristic from '../entities/characteristic';

interface CharacteristicRepository {
  findAll(): Promise<Characteristic[]>;
}

export default CharacteristicRepository;
