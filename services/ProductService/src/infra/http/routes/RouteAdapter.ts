import { Request, Response } from 'express';

import { IController } from "../../../controllers/ports/IController";

export function routeAdapter(controller: IController) {
  return async (request: Request, response: Response) => {
    const httpResponse = await controller.handle(request);
    response.status(httpResponse.statusCode).json(httpResponse.body);
  };
};