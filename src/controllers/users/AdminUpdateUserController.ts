import { container } from "tsyringe";

import { UpdateUserUseCase } from "../../useCases/users/UpdateUserUseCase";
import { MissingParamError } from "../errors/MissingParamError";
import { IController } from "../ports/IController";
import { IHttpRequest } from "../ports/IHttpRequest";
import { IHttpResponse } from "../ports/IHttpResponse";
import { badRequest, forbidden, serverError, unauthorized, updated } from "../utils/HttpResponses";
import { IsRequiredParamsMissing } from "../utils/IsRequiredParamsMissing";

export class AdminUpdateUserController implements IController {
  requiredParams = ["name", "email", "user_id_to_be_updated"];

  async handle(request: IHttpRequest): Promise<IHttpResponse> {
    try {
      const updateUserUseCase = container.resolve(UpdateUserUseCase);

      const requiredParamsMissing = IsRequiredParamsMissing(request.body, this.requiredParams)

      if (requiredParamsMissing) {
        return badRequest(new MissingParamError(requiredParamsMissing).message);
      };

      if (!request.user || !request.user.id) {
        return unauthorized("Admin user is not authenticated!");
      };

      const { name, email, user_id_to_be_updated } = request.body;

      const response = await updateUserUseCase.execute({
        user_id: user_id_to_be_updated,
        name,
        email,
      });


      if (response.isLeft()) {
        return forbidden(response.value.message);
      };

      return updated(response.value);
    } catch (error) {
      return serverError(error);
    }
  }
}