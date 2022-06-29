import { Response } from 'express';

import HTTPError from '@/shared/infra/http/errors/http-error';
import HTTPResponse from '@/shared/infra/http/models/http-response';

class BadRequestHTTPError extends HTTPError {
  toResponse(response: Response): Response {
    return new HTTPResponse(response).badRequest({ message: this.message });
  }
}

export default BadRequestHTTPError;
