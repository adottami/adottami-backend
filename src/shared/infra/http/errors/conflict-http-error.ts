import { Response } from 'express';

import HTTPError from '@/shared/infra/http/errors/http-error';
import HTTPResponse from '@/shared/infra/http/models/http-response';

class ConflictHTTPError extends HTTPError {
  toResponse(response: Response): Response {
    return new HTTPResponse(response).conflict({ message: this.message });
  }
}

export default ConflictHTTPError;
