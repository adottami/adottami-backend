import UnauthorizedHTTPError from '@/shared/infra/http/errors/unauthorized-http-error';

import TokenProvider, { TokenOptions } from '../token-provider';

class TokenProviderMock implements TokenProvider {
  public readonly type: BufferEncoding = 'base64';
  public readonly encoding: BufferEncoding = 'utf8';

  generate({ subject, expiresIn }: TokenOptions): string {
    const data = subject + '.' + expiresIn;

    const dataEncoded = Buffer.from(data, this.encoding).toString(this.type);

    return dataEncoded;
  }

  verify(token: string): string {
    const tokenDecoded = token.split('.');

    const sub = Buffer.from(tokenDecoded[0], this.type).toString(this.encoding);
    const expiresIn = Buffer.from(tokenDecoded[1], this.type).toString(this.encoding);

    const expiresInSeconds = this.transformExpiresInToSeconds(expiresIn);

    if (expiresInSeconds < 60) {
      throw new UnauthorizedHTTPError('Invalid token');
    }

    return sub;
  }

  private transformExpiresInToSeconds(expiresIn: string): number {
    const expiresInSeconds = Number(expiresIn.slice(0, -1));

    return expiresInSeconds;
  }
}

export default TokenProviderMock;
