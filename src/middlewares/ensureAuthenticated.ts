import { inject, injectable } from "tsyringe";

import { IAuthenticationTokenProvider } from "../useCases/ports/IAuthenticationTokenProvider";
import { IHttpRequest } from "./ports/IHttpRequest";
import { IHttpResponse } from "./ports/IHttpResponse";
import { IMiddleware } from "./ports/IMiddleware";
import { unauthorized, ok, serverError } from "./utils/HttpResponses";

@injectable()
export class ensureAuthenticated implements IMiddleware {
  constructor(
    @inject("AuthenticationTokenProvider")
    private authenticationTokenProvider: IAuthenticationTokenProvider,
  ) { }

  async handle(request: IHttpRequest): Promise<IHttpResponse> {

    try {
      if (!request.headers.authorization) {
        return unauthorized("Token is missing!")
      }

      const authHeader = request.headers.authorization;

      const [, token] = authHeader.split(" ");


      const user_id = this.authenticationTokenProvider.verify(
        token,
      );

      if (!user_id) {
        return unauthorized("Token is invalid!");
      }

      request.user = {
        id: user_id,
      }
      return ok("User is authenticated!");
    } catch (error) {
      return serverError(error);
    };
  };
};