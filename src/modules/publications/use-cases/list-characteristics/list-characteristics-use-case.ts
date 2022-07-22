import { inject, injectable } from 'tsyringe';

import UseCaseService from '@/shared/use-cases/use-case-service';

import Characteristic from '../../entities/characteristic';
import CharacteristicRepository from '../../repositories/characteristic-repository';

@injectable()
class ListCharacterisctsUseCase implements UseCaseService<string, Characteristic[]> {
  constructor(
    @inject('CharacteristicRepository')
    private characteristicRepository: CharacteristicRepository,
  ) {}

  async execute(): Promise<Characteristic[]> {
    const characteristics = await this.characteristicRepository.findAll();

    return characteristics;
  }
}

export default ListCharacterisctsUseCase;
