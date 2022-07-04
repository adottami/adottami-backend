import UserRepository from '@/modules/repositories/user-repository';
import User from '@/modules/users/entities/user';
import prisma from '@/shared/infra/prisma/prisma-client';

class PrismaUserRepository implements UserRepository {
  async create({ name, email, password, phoneNumber }: User): Promise<User> {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        phoneNumber,
      },
    });

    return User.create(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    return user ? User.create(user) : null;
  }
}

export default PrismaUserRepository;
