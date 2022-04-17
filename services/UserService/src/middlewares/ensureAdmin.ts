import { inject, injectable } from "tsyringe";

import { IAuthenticationTokenProvider } from "../useCases/users/ports/IAuthenticationTokenProvider";
import { IUsersRepository } from "../useCases/users/ports/IUsersRepository";
import { IHttpRequest } from "./ports/IHttpRequest";
import { IHttpResponse } from "./ports/IHttpResponse";
import { IMiddleware } from "./ports/IMiddleware";
import { unauthorized, ok, serverError } from "./utils/HttpResponses";

@injectable()
export class EnsureAdmin implements IMiddleware {
  constructor(
    @inject("AuthenticationTokenProvider")
    private authenticationTokenProvider: IAuthenticationTokenProvider,
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
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

      const user = await this.usersRepository.findById(user_id);

      if (!user) {
        return unauthorized("User not found!");
      }

      if (!user.isAdmin) {
        return unauthorized("User is not an admin!");
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