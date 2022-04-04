import { container } from "tsyringe";

import { CreateCategoryUseCase } from "../../useCases/categories/CreateCategoryUseCase";
import { CategoryAlreadyExistsError } from "../../useCases/categories/errors/CategoryAlreadyExistsError";
import { MissingParamError } from "../errors/MissingParamError";
import { IController } from "../ports/IController";
import { IHttpResponse } from "../ports/IHttpResponse";
import { IServerlessHttpRequest } from "../ports/IServerlessHttpRequest";
import { badRequest, created, forbidden, serverError, unauthorized } from "../utils/HttpResponses";
import { IsRequiredParamsMissing } from "../utils/IsRequiredParamsMissing";

export class CreateCategoryController implements IController {
  requiredParams = ["name"];

  async handle(request: IServerlessHttpRequest): Promise<IHttpResponse> {
    try {
      console.log(request);
      const authorizer = request.requestContext.authorizer

      if (!authorizer?.user || !authorizer.user?.id) {
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