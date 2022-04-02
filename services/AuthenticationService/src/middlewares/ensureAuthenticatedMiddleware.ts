import { inject, injectable } from "tsyringe";
import { Either, left, right } from "../logic/Either";

import { IAuthenticationTokenProvider } from "../useCases/authentication/ports/IAuthenticationTokenProvider";
import { IHttpRequest } from "./ports/IHttpRequest";
import { IMiddleware } from "./ports/IMiddleware";

@injectable()
export class EnsureAuthenticated implements IMiddleware {
  constructor(
    @inject("AuthenticationTokenProvider")
    private authenticationTokenProvider: IAuthenticationTokenProvider,
  ) { }

  async handle(request: IHttpRequest): Promise<Either<false, string>> {
    try {
      if (!request.headers.authorization) {
        return left(false);
      }

      const authHeader = request.headers.authorization;

      console.log(authHeader);

      const [, token] = authHeader.split(" ");

      const user_id = this.authenticationTokenProvider.verify(
        token,
      );

      if (!user_id) {
        return left(false);
      }

      return right(user_id);
    } catch (error) {
      return left(false);
    };
  };
};