import { container } from "tsyringe";

import { DeleteCategoryUseCase } from "../../useCases/categories/DeleteCategoryUseCase";
import { MissingParamError } from "../errors/MissingParamError";
import { IController } from "../ports/IController";
import { IHttpResponse } from "../ports/IHttpResponse";
import { IServerlessHttpRequest } from "../ports/IServerlessHttpRequest";
import { badRequest, forbidden, ok, serverError, unauthorized } from "../utils/HttpResponses";

export class DeleteCategoryController implements IController {
  async handle(request: IServerlessHttpRequest): Promise<IHttpResponse> {
    try {
      const authorizer = request.requestContext.authorizer

      if (!authorizer?.user || !authorizer.user?.id) {
        return unauthorized("User is not authenticated!");
      };

      if (!request.pathParameters.id) {
        return badRequest(new MissingParamError("category_id").message);
      };

      const { id } = request.pathParameters;

      const deleteCategoryUseCase = container.resolve(DeleteCategoryUseCase);

      const response = await deleteCategoryUseCase.execute({ category_id: id });

      if (response.isLeft()) {
        return forbidden(response.value.message);
      };

      return ok("Category deleted successfully!");
    } catch (error) {
      return serverError(error);
    };
  };
};
