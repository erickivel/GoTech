import { container } from "tsyringe";

import { DeleteUserUseCase } from "../../useCases/users/DeleteUserUseCase";
import { MissingParamError } from "../errors/MissingParamError";
import { IController } from "../ports/IController";
import { IHttpRequest } from "../ports/IHttpRequest";
import { IHttpResponse } from "../ports/IHttpResponse";
import { badRequest, forbidden, ok, serverError, unauthorized } from "../utils/HttpResponses";
import { IsRequiredParamsMissing } from "../utils/IsRequiredParamsMissing";

export class DeleteUserController implements IController {
  requiredParams = ["user_id"];

  async handle(request: IHttpRequest): Promise<IHttpResponse> {
    try {
      const deleteUserUseCase = container.resolve(DeleteUserUseCase);

      const requiredParamsMissing = IsRequiredParamsMissing(request.params, this.requiredParams)

      if (requiredParamsMissing) {
        return badRequest(new MissingParamError(requiredParamsMissing).message);
      };

      const { user_id } = request.params;

      if (!request.user || !request.user.id) {
        return unauthorized("User is not authenticated!");
      };

      const response = await deleteUserUseCase.execute({ userIdToBeDeleted: user_id });

      if (response.isLeft()) {
        return forbidden(response.value.message)
      }

      return ok("User deleted!");
    } catch (error) {
      return serverError(error);
    }
  }
}