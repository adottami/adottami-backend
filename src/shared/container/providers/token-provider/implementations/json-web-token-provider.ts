import { sign, verify } from 'jsonwebtoken';

import globalConfig from '@/config/global-config/global-config';

import TokenProvider, { TokenOptions } from '../token-provider';

class JsonWebTokenProvider implements TokenProvider {
  private readonly key: string = globalConfig.jwtSecret();

  generate({ subject, expiresIn }: TokenOptions): string {
    const generatedToken = sign({}, this.key, {
      subject,
      expiresIn,
    });

    return generatedToken;
  }

  verify(token: string): string {
    const { sub } = verify(token, this.key);

    return sub as string;
  }
}

export default JsonWebTokenProvider;
