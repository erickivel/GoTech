import { container } from "tsyringe";

import { CreateCategoryUseCase } from "../../useCases/categories/CreateCategoryUseCase";
import { CategoryAlreadyExistsError } from "../../useCases/categories/errors/CategoryAlreadyExistsError";
import { MissingParamError } from "../errors/MissingParamError";
import { IController } from "../ports/IController";
import { IHttpRequest } from "../ports/IHttpRequest";
import { IHttpResponse } from "../ports/IHttpResponse";
import { badRequest, created, forbidden, serverError, unauthorized } from "../utils/HttpResponses";
import { IsRequiredParamsMissing } from "../utils/IsRequiredParamsMissing";

export class CreateCategoryController implements IController {
  requiredParams = ["name"];

  async handle(request: IHttpRequest): Promise<IHttpResponse> {
    try {
      if (!request.user || !request.user.id) {
        return unauthorized("User is not authenticated!");
      };

      const requiredParamsMissing = IsRequiredParamsMissing(request.body, this.requiredParams)

      if (requiredParamsMissing) {
        return badRequest(new MissingParamError(requiredParamsMissing).message);
      };

      const { name } = request.body;

      const createCategoryUseCase = container.resolve(CreateCategoryUseCase);

      const response = await createCategoryUseCase.execute({ name });

      if (response.isRight()) {
        return created(response.value);
      };

      if (response.value instanceof CategoryAlreadyExistsError) {
        return forbidden(response.value.message);
      };

      return badRequest(response.value.message);
    } catch (error) {
      return serverError(error);
    };
  };
};