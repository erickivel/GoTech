import { container } from "tsyringe";

import { DeleteCategoryUseCase } from "../../useCases/categories/DeleteCategoryUseCase";
import { MissingParamError } from "../errors/MissingParamError";
import { IController } from "../ports/IController";
import { IHttpRequest } from "../ports/IHttpRequest";
import { IHttpResponse } from "../ports/IHttpResponse";
import { badRequest, forbidden, ok, serverError, unauthorized } from "../utils/HttpResponses";

export class DeleteCategoryController implements IController {
  async handle(request: IHttpRequest): Promise<IHttpResponse> {
    try {
      if (!request.user || !request.user.id) {
        return unauthorized("User is not authenticated!");
      };

      if (!request.params.category_id) {
        return badRequest(new MissingParamError("category_id").message);
      };

      const { category_id } = request.params;

      const deleteCategoryUseCase = container.resolve(DeleteCategoryUseCase);

      const response = await deleteCategoryUseCase.execute({ category_id });

      if (response.isLeft()) {
        return forbidden(response.value.message);
      };

      return ok("Category deleted successfully!");
    } catch (error) {
      return serverError(error);
    };
  };
};
