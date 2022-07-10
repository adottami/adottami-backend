import User from '@/modules/users/entities/user';

interface UserRepository {
  create(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  updatePassword(userId: string, newPassword: string): Promise<void>;
}

export default UserRepository;
