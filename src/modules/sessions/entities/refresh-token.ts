import Entity, { EntityProps } from '@/shared/entities/entity';

interface RefreshTokenProps extends EntityProps {
  userId: string;
  expiresIn: Date;
}

class RefreshToken extends Entity {
  readonly userId: string;
  readonly expiresIn: Date;

  private constructor({ id, userId, expiresIn }: RefreshTokenProps) {
    super({ id });
    this.userId = userId;
    this.expiresIn = expiresIn;
  }

  static create(refreshTokenProps: RefreshTokenProps) {
    const refreshToken = new RefreshToken(refreshTokenProps);

    return refreshToken;
  }
}

export default RefreshToken;
