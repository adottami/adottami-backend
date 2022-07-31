import User from '@/modules/users/entities/user';
import UserRepository from '@/modules/users/repositories/user-repository';
import prisma from '@/shared/infra/prisma/prisma-client';

class PrismaUserRepository implements UserRepository {
  async create({ name, email, password, phoneNumber }: User): Promise<User> {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        phoneNumber: phoneNumber as string,
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

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    return user ? User.create(user) : null;
  }

  async updatePassword(id: string, newPassword: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { password: newPassword },
    });
  }

  async update(id: string, { name, email, phoneNumber }: User): Promise<User> {
    const user = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        phoneNumber: phoneNumber as string,
      },
    });

    return User.create(user);
  }
}

export default PrismaUserRepository;
