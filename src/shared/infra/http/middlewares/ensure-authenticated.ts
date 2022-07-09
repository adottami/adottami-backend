import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';

import TokenProvider from '@/shared/container/providers/token-provider/token-provider';

import UnauthorizedHTTPError from '../errors/unauthorized-http-error';

function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
  const authToken = request.headers.authorization;

  if (!authToken) {
    throw new UnauthorizedHTTPError('Token is missing');
  }

  const [scheme, token] = authToken.split(' ');

  if (!/^Bearer$/i.test(scheme)) {
    throw new UnauthorizedHTTPError('Badly formatted token');
  }

  try {
    const tokenProvider = container.resolve<TokenProvider>('TokenProvider');

    const sub = tokenProvider.verify(token);

    request.userId = sub;
    return next();
  } catch (error) {
    throw new UnauthorizedHTTPError('Invalid token');
  }
}

export default ensureAuthenticated;
