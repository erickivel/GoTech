import { container } from "tsyringe";

import { UserNotFoundError } from "../../useCases/users/errors/UserNotFoundError";
import { UserProfileUseCase } from "../../useCases/users/UserProfileUseCase";
import { MissingParamError } from "../errors/MissingParamError";
import { IController } from "../ports/IController";
import { IHttpRequest } from "../ports/IHttpRequest";
import { IHttpResponse } from "../ports/IHttpResponse";
import { badRequest, forbidden, ok, serverError } from "../utils/HttpResponses";

export class UserProfileController implements IController {
  async handle(request: IHttpRequest): Promise<IHttpResponse> {
    try {
      const userProfileUseCase = container.resolve(UserProfileUseCase);

      if (!request.user || !request.user.id) {
        return badRequest(new MissingParamError("user id").message);
      };

      const { id } = request.user;

      const response = await userProfileUseCase.execute({
        user_id: id
      });

      if (response.value instanceof UserNotFoundError) {
        return forbidden(response.value.message);
      };

      return ok(response.value);
    } catch (error) {
      return serverError(error);
    }
  }
}