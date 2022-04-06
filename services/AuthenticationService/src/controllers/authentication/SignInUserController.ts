import { container } from "tsyringe";

import { IncorrectCredentialsError } from "../../useCases/authentication/errors/IncorrectCredentialsError";
import { SignInUserUseCase } from "../../useCases/authentication/SignInUserUseCase";
import { MissingParamError } from "../errors/MissingParamError";
import { IController } from "../ports/IController";
import { IHttpRequest } from "../ports/IHttpRequest";
import { IHttpResponse } from "../ports/IHttpResponse";
import { badRequest, forbidden, ok, serverError } from "../utils/HttpResponses";
import { IsRequiredParamsMissing } from "../utils/IsRequiredParamsMissing";

export class SignInUserController implements IController {
  readonly requiredParams = ["email", "password"];

  async handle(request: IHttpRequest): Promise<IHttpResponse> {
    try {
      const signInUserUseCase = container.resolve(SignInUserUseCase);

      const requiredParamsMissing = IsRequiredParamsMissing(request.body, this.requiredParams)

      if (requiredParamsMissing) {
        return badRequest(new MissingParamError(requiredParamsMissing).message);
      };

      const { email, password } = request.body;


      const response = await signInUserUseCase.execute({
        email,
        password
      });

      if (response.value instanceof IncorrectCredentialsError) {
        return forbidden(response.value.message);
      };

      return ok(response.value);
    } catch (error) {
      console.error(error);
      return serverError(error);
    }
  }
}