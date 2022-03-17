import { NextFunction, Request, Response } from "express";

import { IMiddleware } from "../../../middlewares/ports/IMiddleware";

export function MiddlewareRouteAdapter(middleware: IMiddleware) {
  return async (
    request: Request, response: Response, next: NextFunction
  ): Promise<void> => {
    const httpResponse = await middleware.handle(request);

    response.status(httpResponse.statusCode).json(httpResponse.body);

    if (httpResponse.statusCode === 200) {
      next();
    }
  }
}