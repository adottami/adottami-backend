import { sign } from 'jsonwebtoken';

import globalConfig from '@/config/global-config/global-config';

import { TokenProvider, TokenOptions } from '../token-provider';

class JWTTokenProvider implements TokenProvider {
  private readonly key: string = globalConfig.jwtSecret();

  generate({ subject, expiresIn }: TokenOptions): string {
    const generatedToken = sign({}, this.key, {
      subject,
      expiresIn,
    });

    return generatedToken;
  }
}

export default JWTTokenProvider;
