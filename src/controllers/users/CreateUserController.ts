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

  constructor(
    private createUserUseCase: CreateUserUseCase
  ) { }

  async handle(request: IHttpRequest): Promise<IHttpResponse> {
    try {
      const requiredParamsMissing = IsRequiredParamsMissing(request.body, this.requiredParams)

      if (requiredParamsMissing) {
        return badRequest(new MissingParamError(requiredParamsMissing));
      };

      const { name, email, password } = request.body;

      const response = await this.createUserUseCase.execute({
        name,
        email,
        password
      });

      if (response.isRight()) {
        return created("User Created!");
      }

      if (response.value instanceof UserAlreadyExistsError) {
        return forbidden(response.value);
      };

      return badRequest(response.value);
    } catch (error) {
      return serverError(error);
    }
  }
}