import RefreshToken from '../entities/refresh-token';

interface RefreshTokenRepository {
  create(userId: string, expiresIn: Date): Promise<RefreshToken>;
  findUnique(id: string): Promise<RefreshToken | null>;
  delete(id: string): Promise<void>;
  deleteMany(userId: string): Promise<void>;
}

export default RefreshTokenRepository;
