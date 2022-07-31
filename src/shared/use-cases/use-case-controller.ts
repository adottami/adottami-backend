import { Request, Response } from 'express';

interface UseCaseController {
  handle(request: Request, response: Response): Promise<Response>;
}

export default UseCaseController;
