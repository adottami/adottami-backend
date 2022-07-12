import Characteristic from '@/modules/publications/entities/characteristic';
import CharacteristictRepository from '@/modules/publications/repositories/characteristic-repository';
import prisma from '@/shared/infra/prisma/prisma-client';

class PrismaCharacteristicRepository implements CharacteristictRepository {
  async findAll(): Promise<Characteristic[]> {
    const characteristicsData = await prisma.characteristic.findMany();

    const characteristics = Characteristic.createMany(characteristicsData);

    return characteristics;
  }
}

export default PrismaCharacteristicRepository;
