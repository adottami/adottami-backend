import { NextFunction, Request, Response } from 'express';

import HTTPError from '@/shared/infra/http/errors/http-error';

import InternalServerHTTPError from '../errors/internal-server-http-error';

function handleApplicationError(error: unknown, _request: Request, response: Response, _next: NextFunction): Response {
  if (error instanceof HTTPError) {
    return error.toResponse(response);
  }
  if (error instanceof Error) {
    return new InternalServerHTTPError(error.message).toResponse(response);
  }
  throw error;
}

export default handleApplicationError;
