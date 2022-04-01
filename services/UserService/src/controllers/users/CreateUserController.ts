import { container } from "tsyringe";

import { CreateUserUseCase } from "../../useCases/users/CreateUserUseCase";
import { UserAlreadyExistsError } from "../../useCases/users/errors/UserAlreadyExistsError";
import { MissingParamError } from "../errors/MissingParamError";
import { IController } from "../ports/IController";
import { IHttpRequest } from "../ports/IHttpRequest";
import { IHttpResponse } from "../ports/IHttpResponse";
import { badRequest, created, forbidden, serverError } from "../utils/HttpResponses";
import { IsRequiredParamsMissing } from "../utils/IsRequiredParamsMissing";

export class CreateUserController implements IController {
  readonly requiredParams = ["name", "email", "password"];

  async handle(request: IHttpRequest): Promise<IHttpResponse> {
    try {
      const createUserUseCase = container.resolve(CreateUserUseCase);

      const requiredParamsMissing = IsRequiredParamsMissing(request.body, this.requiredParams)

      if (requiredParamsMissing) {
        return badRequest(new MissingParamError(requiredParamsMissing).message);
      };

      const { name, email, password } = request.body;

      const response = await createUserUseCase.execute({
        name,
        email,
        password
      });


      if (response.isRight()) {
        return created("User Created!");
      }

      if (response.value instanceof UserAlreadyExistsError) {
        return forbidden(response.value.message);
      };

      return badRequest(response.value.message);
    } catch (error) {
      return serverError(error);
    }
  }
}