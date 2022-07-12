import CharacteristicRepository from '@/modules/publications/repositories/characteristic-repository';
import CharacteristicRepositoryMock from '@/modules/publications/repositories/mocks/characteristic-repository-mock';

import ListCharacteristicUseCase from '../list-characteristics-use-case';

describe('List publication characteristics use case', () => {
  let characteristicRepository: CharacteristicRepository;
  let useCase: ListCharacteristicUseCase;

  beforeEach(() => {
    characteristicRepository = new CharacteristicRepositoryMock();
    useCase = new ListCharacteristicUseCase(characteristicRepository);
  });

  it('should be able to get the characteristics list', async () => {
    const characteristics = await useCase.execute();

    expect(characteristics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: '1', name: 'Brincalhão' }),
        expect.objectContaining({ id: '2', name: 'Dócil' }),
        expect.objectContaining({ id: '3', name: 'Calmo' }),
        expect.objectContaining({ id: '4', name: 'Sociável' }),
        expect.objectContaining({ id: '5', name: 'Sociável com crianças' }),
        expect.objectContaining({ id: '6', name: 'Castrado' }),
        expect.objectContaining({ id: '7', name: 'Vacinado' }),
        expect.objectContaining({ id: '8', name: 'Vermifugado' }),
        expect.objectContaining({ id: '9', name: 'Vive bem em apartamento' }),
        expect.objectContaining({ id: '10', name: 'Vive bem em casa com quintal' }),
      ]),
    );
  });
});
