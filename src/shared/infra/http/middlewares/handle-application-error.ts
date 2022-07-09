import { NextFunction, Request, Response } from 'express';
import { MulterError } from 'multer';

import HTTPError from '@/shared/infra/http/errors/http-error';

import BadRequestHTTPError from '../errors/bad-request-http-error';
import InternalServerHTTPError from '../errors/internal-server-http-error';

function handleApplicationError(error: unknown, _request: Request, response: Response, _next: NextFunction): Response {
  if (error instanceof MulterError) {
    return new BadRequestHTTPError(error.message).toResponse(response);
  }
  if (error instanceof HTTPError) {
    return error.toResponse(response);
  }
  if (error instanceof Error) {
    return new InternalServerHTTPError(error.message).toResponse(response);
  }
  throw error;
}

export default handleApplicationError;
