import User from '@/modules/users/entities/user';

interface UserRepository {
  create(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
}

export default UserRepository;
