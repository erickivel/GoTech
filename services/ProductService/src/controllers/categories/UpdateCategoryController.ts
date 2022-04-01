import { container } from "tsyringe";

import { CategoryAlreadyExistsError } from "../../useCases/categories/errors/CategoryAlreadyExistsError";
import { UpdateCategoryUseCase } from "../../useCases/categories/UpdateCategoryUseCase";
import { MissingParamError } from "../errors/MissingParamError";
import { IController } from "../ports/IController";
import { IHttpRequest } from "../ports/IHttpRequest";
import { IHttpResponse } from "../ports/IHttpResponse";
import { badRequest, forbidden, serverError, unauthorized, updated } from "../utils/HttpResponses";
import { IsRequiredParamsMissing } from "../utils/IsRequiredParamsMissing";

export class UpdateCategoryController implements IController {
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

      if (!request.params.id) {
        return badRequest(new MissingParamError("category_id").message);
      };

      const { name } = request.body;
      const { id } = request.params;

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
