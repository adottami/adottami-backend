import { TokenExpiredError } from 'jsonwebtoken';

import HTTPResponse from '@/shared/infra/http/models/http-response';

import TokenProvider from '../../token-provider';
import JsonWebTokenProvider from '../json-web-token-provider';

describe('JSON web token provider', () => {
  let tokenProvider: TokenProvider;
  const subject = '12345';
  const expiresIn = '10m';

  beforeEach(() => {
    tokenProvider = new JsonWebTokenProvider();
  });

  it('should be able to generate a token for subject and expiration time', () => {
    const token = tokenProvider.generate({ subject, expiresIn });

    expect(token).not.toBeNaN();
    expect(token).not.toBeNull();
    expect(token).not.toBeUndefined();
    expect(token).not.toBe('');
    expect(token).toMatch(/./);
    expect(token.length).toBeGreaterThanOrEqual(1);
  });

  it('should be able get different tokens by different payloads', () => {
    const differentSubject = '1234';
    const differentExpiresIn = '100m';

    const token = tokenProvider.generate({ subject, expiresIn });

    const otherToken = tokenProvider.generate({
      subject: differentSubject,
      expiresIn: differentExpiresIn,
    });

    expect(token).not.toBe(otherToken);
  });

  it('should be able to extract the subject through the token', () => {
    const token = tokenProvider.generate({ subject, expiresIn });

    const tokenSubject = tokenProvider.verify(token);

    expect(tokenSubject).not.toBeNaN();
    expect(tokenSubject).not.toBeNull();
    expect(tokenSubject).not.toBeUndefined();
    expect(subject).toBe(tokenSubject);
  });

  it('should be not able to verify token with expired time', () => {
    const expiredTime = '0s';

    const token = tokenProvider.generate({
      subject,
      expiresIn: expiredTime,
    });

    expect(() => {
      tokenProvider.verify(token);
    }).toThrow(TokenExpiredError);
  });
});
