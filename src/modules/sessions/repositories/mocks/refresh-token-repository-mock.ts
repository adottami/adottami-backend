import RefreshToken from '../../entities/refresh-token';
import RefreshTokenRepository from '../refresh-token-repository';

class RefreshTokenRepositoryMock implements RefreshTokenRepository {
  constructor(private refreshTokens: RefreshToken[] = []) {}

  async create(userId: string, expiresIn: Date): Promise<RefreshToken> {
    const id = Date.now().toString();

    const refreshToken = RefreshToken.create({ id, userId, expiresIn });

    this.refreshTokens.push(refreshToken);

    return refreshToken;
  }

  async findUnique(id: string): Promise<RefreshToken | null> {
    const refreshToken = this.refreshTokens.find((refreshToken) => refreshToken.id === id);

    return refreshToken || null;
  }

  async delete(id: string): Promise<void> {
    this.refreshTokens = this.refreshTokens.filter((refreshToken) => refreshToken.id !== id);
  }

  async deleteMany(userId: string): Promise<void> {
    this.refreshTokens = this.refreshTokens.filter((refreshToken) => refreshToken.userId !== userId);
  }
}

export default RefreshTokenRepositoryMock;
