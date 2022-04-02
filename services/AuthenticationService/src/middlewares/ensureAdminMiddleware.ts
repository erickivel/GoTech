import { inject, injectable } from "tsyringe";
import { Either, left, right } from "../logic/Either";

import { IAuthenticationTokenProvider } from "../useCases/authentication/ports/IAuthenticationTokenProvider";
import { IUsersRepository } from "../useCases/authentication/ports/IUsersRepository";
import { IHttpRequest } from "./ports/IHttpRequest";
import { IMiddleware } from "./ports/IMiddleware";

@injectable()
export class EnsureAdmin implements IMiddleware {
  constructor(
    @inject("AuthenticationTokenProvider")
    private authenticationTokenProvider: IAuthenticationTokenProvider,
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
  ) { }

  async handle(request: IHttpRequest): Promise<Either<false, string>> {
    try {
      if (!request.headers.authorization) {
        return left(false);
      }

      const authHeader = request.headers.authorization;

      const [, token] = authHeader.split(" ");

      const user_id = this.authenticationTokenProvider.verify(
        token,
      );

      if (!user_id) {
        return left(false);
      }

      const user = await this.usersRepository.findById(user_id);

      if (!user) {
        return left(false);
      }

      if (!user.isAdmin) {
        return left(false);
      }

      request.user = {
        id: user_id,
      }
      return right(user_id);
    } catch (error) {
      return left(false);
    };
  };
};