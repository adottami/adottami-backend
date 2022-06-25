import { Response } from 'express';

class HTTPResponse {
  constructor(private response: Response) {}

  ok<ResponseBody>(body?: ResponseBody): Response {
    return this.response.status(200).json(body);
  }

  created<ResponseBody>(body?: ResponseBody): Response {
    return this.response.status(201).json(body);
  }

  noContent(): Response {
    return this.response.status(204).send();
  }

  badRequest<ResponseBody>(body?: ResponseBody): Response {
    return this.response.status(400).json(body);
  }

  unauthorized<ResponseBody>(body?: ResponseBody): Response {
    return this.response.status(401).json(body);
  }

  forbidden<ResponseBody>(body?: ResponseBody): Response {
    return this.response.status(403).json(body);
  }

  notFound<ResponseBody>(body?: ResponseBody): Response {
    return this.response.status(404).json(body);
  }

  conflict<ResponseBody>(body?: ResponseBody): Response {
    return this.response.status(409).json(body);
  }

  internalServerError<ResponseBody>(body?: ResponseBody): Response {
    return this.response.status(500).json(body);
  }
}

export default HTTPResponse;
