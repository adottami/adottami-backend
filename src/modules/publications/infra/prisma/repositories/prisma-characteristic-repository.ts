import Characteristic from '@/modules/publications/entities/characteristic';
import CharacteristicRepository from '@/modules/publications/repositories/characteristic-repository';
import prisma from '@/shared/infra/prisma/prisma-client';

class PrismaCharacteristicRepository implements CharacteristicRepository {
  async findAll(): Promise<Characteristic[]> {
    const characteristicsData = await prisma.characteristic.findMany();

    const characteristics = Characteristic.createMany(characteristicsData);

    return characteristics;
  }

  async findById(id: string): Promise<Characteristic | null> {
    const characteristic = await prisma.characteristic.findUnique({
      where: { id },
    });

    return characteristic ? Characteristic.create(characteristic) : null;
  }
}

export default PrismaCharacteristicRepository;
