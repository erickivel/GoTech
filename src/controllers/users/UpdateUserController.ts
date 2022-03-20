import { container } from "tsyringe";

import { UpdateUserUseCase } from "../../useCases/users/UpdateUserUseCase";
import { MissingParamError } from "../errors/MissingParamError";
import { IController } from "../ports/IController";
import { IHttpRequest } from "../ports/IHttpRequest";
import { IHttpResponse } from "../ports/IHttpResponse";
import { badRequest, forbidden, serverError, updated } from "../utils/HttpResponses";
import { IsRequiredParamsMissing } from "../utils/IsRequiredParamsMissing";

export class UpdateUserController implements IController {
  requiredParams = ["name", "email"];

  async handle(request: IHttpRequest): Promise<IHttpResponse> {
    try {
      const updateUserUseCase = container.resolve(UpdateUserUseCase);

      const requiredParamsMissing = IsRequiredParamsMissing(request.body, this.requiredParams)

      if (requiredParamsMissing) {
        return badRequest(new MissingParamError(requiredParamsMissing).message);
      };

      if (!request.user || !request.user.id) {
        return badRequest(new MissingParamError("user id").message);
      };

      const { id } = request.user;
      const { name, email, old_password, new_password, confirm_password } = request.body;

      let response;




      if (old_password && new_password && confirm_password) {
        response = await updateUserUseCase.execute({
          user_id: id,
          name,
          email,
          old_password,
          new_password,
          confirm_password
        });
      } else if (old_password && (!new_password || !confirm_password)) {
        const paramsMissing = `${!new_password ? "new_password" : ""}${!new_password && !confirm_password ? ", " : ""}${!confirm_password ? "confirm_password" : ""}`;
        return badRequest(new MissingParamError(paramsMissing).message);
      } else {
        response = await updateUserUseCase.execute({
          user_id: id,
          name,
          email,
        });
      }

      if (response.isLeft()) {
        return forbidden(response.value.message);
      };

      return updated(response.value);
    } catch (error) {
      return serverError(error);
    }
  }
}