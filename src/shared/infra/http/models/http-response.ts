import { Response } from 'express';

class HTTPResponse {
  static STATUS_CODE = Object.freeze({
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
  });

  constructor(private response: Response) {}

  ok<ResponseBody>(body?: ResponseBody): Response {
    return this.response.status(HTTPResponse.STATUS_CODE.OK).json(body);
  }

  created<ResponseBody>(body?: ResponseBody): Response {
    return this.response.status(HTTPResponse.STATUS_CODE.CREATED).json(body);
  }

  noContent(): Response {
    return this.response.status(HTTPResponse.STATUS_CODE.NO_CONTENT).send();
  }

  badRequest<ResponseBody>(body?: ResponseBody): Response {
    return this.response.status(HTTPResponse.STATUS_CODE.BAD_REQUEST).json(body);
  }

  unauthorized<ResponseBody>(body?: ResponseBody): Response {
    return this.response.status(HTTPResponse.STATUS_CODE.UNAUTHORIZED).json(body);
  }

  forbidden<ResponseBody>(body?: ResponseBody): Response {
    return this.response.status(HTTPResponse.STATUS_CODE.FORBIDDEN).json(body);
  }

  notFound<ResponseBody>(body?: ResponseBody): Response {
    return this.response.status(HTTPResponse.STATUS_CODE.NOT_FOUND).json(body);
  }

  conflict<ResponseBody>(body?: ResponseBody): Response {
    return this.response.status(HTTPResponse.STATUS_CODE.CONFLICT).json(body);
  }

  internalServerError<ResponseBody>(body?: ResponseBody): Response {
    return this.response.status(HTTPResponse.STATUS_CODE.INTERNAL_SERVER_ERROR).json(body);
  }
}

export default HTTPResponse;
