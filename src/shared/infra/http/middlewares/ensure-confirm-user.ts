import { NextFunction, Request, Response } from 'express';

import UnauthorizedHTTPError from '../errors/unauthorized-http-error';

function ensureConfirmUser(request: Request, response: Response, next: NextFunction) {
  const userIdToken = request.userId;
  const idParams = request.params.id;

  if (!userIdToken || !idParams || userIdToken !== idParams) {
    throw new UnauthorizedHTTPError('Access denied');
  }

  return next();
}

export default ensureConfirmUser;
