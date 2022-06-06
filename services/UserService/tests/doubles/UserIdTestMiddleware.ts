import { NextFunction, Request, Response } from "express";

export async function UserIdTestMiddleware(
  request: Request, response: Response, next: NextFunction
): Promise<Response | void> {
  try {
    if (!request.headers.userid) {
      return response.status(401).json("User id missing!");
    }

    const userId = request.headers.userid;

    request.user = {
      id: userId.toString(),
    }

    next();
  } catch (error) {
    response.status(500).json(error);
  };
};