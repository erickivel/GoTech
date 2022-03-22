import { container } from "tsyringe";

import { ListAllUsersUseCase } from "../../useCases/users/ListAllUsersUseCase";
import { MissingParamError } from "../errors/MissingParamError";
import { IController } from "../ports/IController";
import { IHttpRequest } from "../ports/IHttpRequest";
import { IHttpResponse } from "../ports/IHttpResponse";
import { badRequest, forbidden, ok, serverError } from "../utils/HttpResponses";

export class ListAllUsersController implements IController {
  async handle(request: IHttpRequest): Promise<IHttpResponse> {
    try {
      const listAllUsersUseCase = container.resolve(ListAllUsersUseCase);

      if (!request.user || !request.user.id) {
        return badRequest(new MissingParamError("user id").message);
      };

      const { id } = request.user;

      const response = await listAllUsersUseCase.execute({
        user_id: id
      });

      if (response.isLeft()) {
        return forbidden(response.value.message);
      };

      return ok(response.value);
    } catch (error) {
      return serverError(error);
    }
  }
}