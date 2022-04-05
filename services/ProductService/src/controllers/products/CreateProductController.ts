import { container } from "tsyringe";

import { CategoryNotFoundError } from "../../useCases/categories/errors/CategoryNotFoundError";
import { ProductAlreadyExistsError } from "../../useCases/products/errors/ProductAlreadyExistsError";
import { CreateProductUseCase } from "../../useCases/products/CreateProductUseCase";
import { MissingParamError } from "../errors/MissingParamError";
import { IController } from "../ports/IController";
import { IHttpResponse } from "../ports/IHttpResponse";
import { IServerlessHttpRequest } from "../ports/IServerlessHttpRequest";
import { badRequest, created, forbidden, serverError, unauthorized } from "../utils/HttpResponses";
import { IsRequiredParamsMissing } from "../utils/IsRequiredParamsMissing";

export class CreateProductController implements IController {
  requiredParams = ["name", "stock", "price", "categoryId"];

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

      const { name, stock, price, categoryId } = request.body;

      const createProductUseCase = container.resolve(CreateProductUseCase);

      const response = await createProductUseCase.execute({ name, stock, price, categoryId });

      if (response.isRight()) {
        return created(response.value);
      };

      if (
        response.value instanceof ProductAlreadyExistsError
        || response.value instanceof CategoryNotFoundError) {
        return forbidden(response.value.message);
      };

      return badRequest(response.value.message);
    } catch (error) {
      return serverError(error);
    };
  };
};