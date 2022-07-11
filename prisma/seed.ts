import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();

  const characteristics = await prisma.characteristic.findMany();

  if (characteristics.length > 0) {
    await prisma.characteristic.deleteMany({});
  }

  await prisma.characteristic.createMany({
    data: [
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
    ],
  });
}

main();
