import User from '@/modules/users/entities/user';

interface UpdateUser {
  name: string;
  email: string;
  phoneNumber?: string;
}

interface UserRepository {
  create(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  updatePassword(userId: string, newPassword: string): Promise<void>;
  update(id: string, updateUser: UpdateUser): Promise<User>;
}

export default UserRepository;
