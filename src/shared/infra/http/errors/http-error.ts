import { Response } from 'express';

abstract class HTTPError extends Error {
  abstract toResponse(response: Response): Response;
}

export default HTTPError;
