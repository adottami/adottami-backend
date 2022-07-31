import User from '@/modules/users/entities/user';
import UserRepository from '@/modules/users/repositories/user-repository';

class UserRepositoryMock implements UserRepository {
  constructor(private users: User[] = []) {}

  async create({ name, email, password, phoneNumber }: User): Promise<User> {
    const user = User.create({ name, email, password, phoneNumber });

    this.users.push(user);

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((user) => user.email === email);

    return user || null;
  }

  async findById(id: string): Promise<User | null> {
    const user = this.users.find((user) => user.id === id);

    return user || null;
  }

  async updatePassword(id: string, newPassword: string): Promise<void> {
    const userIndex = this.users.findIndex((user) => user.id === id);

    const newUser = User.create({ ...this.users[userIndex], password: newPassword });

    this.users[userIndex] = newUser;
  }

  async update(id: string, { name, email, phoneNumber }: User): Promise<User> {
    const userIndex = this.users.findIndex((user) => user.id === id);

    Object.assign(this.users[userIndex], {
      name,
      email,
      phoneNumber,
    });

    return this.users[userIndex];
  }
}

export default UserRepositoryMock;
