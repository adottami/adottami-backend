import RefreshToken from '@/modules/sessions/entities/refresh-token';
import RefreshTokenRepository from '@/modules/sessions/repositories/refresh-token-repository';
import prisma from '@/shared/infra/prisma/prisma-client';

class PrismaRefreshTokenRepository implements RefreshTokenRepository {
  async create(userId: string, expiresIn: Date): Promise<RefreshToken> {
    const refreshToken = await prisma.refreshToken.create({
      data: {
        userId,
        expiresIn,
      },
    });

    return RefreshToken.create(refreshToken);
  }

  async findUnique(id: string): Promise<RefreshToken | null> {
    const refreshToken = await prisma.refreshToken.findUnique({
      where: {
        id,
      },
    });

    return refreshToken ? RefreshToken.create(refreshToken) : null;
  }

  async delete(id: string): Promise<void> {
    await prisma.refreshToken.delete({
      where: {
        id,
      },
    });
  }

  async deleteMany(userId: string): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: {
        userId,
      },
    });
  }
}

export default PrismaRefreshTokenRepository;
