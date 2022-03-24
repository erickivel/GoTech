import { container } from "tsyringe";

import { ListAllUsersUseCase } from "../../useCases/users/ListAllUsersUseCase";
import { IController } from "../ports/IController";
import { IHttpRequest } from "../ports/IHttpRequest";
import { IHttpResponse } from "../ports/IHttpResponse";
import { ok, serverError, unauthorized } from "../utils/HttpResponses";

export class ListAllUsersController implements IController {
  async handle(request: IHttpRequest): Promise<IHttpResponse> {
    try {
      const listAllUsersUseCase = container.resolve(ListAllUsersUseCase);

      if (!request.user || !request.user.id) {
        return unauthorized("User is not authenticated!");
      };

      const response = await listAllUsersUseCase.execute();

      return ok(response.value);
    } catch (error) {
      return serverError(error);
    }
  }
}