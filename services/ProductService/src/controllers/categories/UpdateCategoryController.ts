import { container } from "tsyringe";

import { CategoryAlreadyExistsError } from "../../useCases/categories/errors/CategoryAlreadyExistsError";
import { UpdateCategoryUseCase } from "../../useCases/categories/UpdateCategoryUseCase";
import { MissingParamError } from "../errors/MissingParamError";
import { IController } from "../ports/IController";
import { IHttpResponse } from "../ports/IHttpResponse";
import { IServerlessHttpRequest } from "../ports/IServerlessHttpRequest";
import { badRequest, forbidden, serverError, unauthorized, updated } from "../utils/HttpResponses";
import { IsRequiredParamsMissing } from "../utils/IsRequiredParamsMissing";

export class UpdateCategoryController implements IController {
  requiredParams = ["name"];

  async handle(request: IServerlessHttpRequest): Promise<IHttpResponse> {
    try {
      const authorizer = request.requestContext.authorizer

      if (!authorizer?.user || !authorizer.user?.id) {
        return unauthorized("User is not authenticated!");
      };

      const requiredParamsMissing = IsRequiredParamsMissing(request.body, this.requiredParams)

      if (requiredParamsMissing) {
        return badRequest(new MissingParamError(requiredParamsMissing).message);
      };

      if (!request.pathParameters.id) {
        return badRequest(new MissingParamError("category_id").message);
      };

      const { name } = request.body;
      const { id } = request.pathParameters;

      const updateCategoryUseCase = container.resolve(UpdateCategoryUseCase);

      const response = await updateCategoryUseCase.execute({ name, category_id: id });

      if (response.isRight()) {
        return updated(response.value);
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
