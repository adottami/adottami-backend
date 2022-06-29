import { Response } from 'express';

import HTTPError from '@/shared/infra/http/errors/http-error';
import HTTPResponse from '@/shared/infra/http/models/http-response';

class InternalServerHTTPError extends HTTPError {
  toResponse(response: Response): Response {
    return new HTTPResponse(response).internalServerError({ message: this.message });
  }
}

export default InternalServerHTTPError;
