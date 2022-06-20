import { container } from "tsyringe";
import { CategoryNotFoundError } from "../../useCases/categories/errors/CategoryNotFoundError";
import { ProductAlreadyExistsError } from "../../useCases/products/errors/ProductAlreadyExistsError";

import { UpdateProductUseCase } from "../../useCases/products/UpdateProductUseCase";
import { MissingParamError } from "../errors/MissingParamError";
import { IController } from "../ports/IController";
import { IHttpResponse } from "../ports/IHttpResponse";
import {
  badRequest,
  forbidden,
  serverError,
  unauthorized,
  updated,
} from "../utils/HttpResponses";
import { IsRequiredParamsMissing } from "../utils/IsRequiredParamsMissing";

export class UpdateProductController implements IController {
  requiredParams = ["name", "stock", "price"];

  async handle(request: any): Promise<IHttpResponse> {
    try {
      const authorizer = request.requestContext.authorizer.lambda;

      if (!authorizer?.user || !authorizer.user?.id) {
        return unauthorized("User is not authenticated!");
      }

      const requiredParamsMissing = IsRequiredParamsMissing(
        request.body,
        this.requiredParams
      );

      if (requiredParamsMissing) {
        return badRequest(new MissingParamError(requiredParamsMissing).message);
      }

      if (!request.pathParameters.id) {
        return badRequest(new MissingParamError("product id").message);
      }

      const { name, stock, price, categoryId } = request.body;
      const { id } = request.pathParameters;

      const updateProductUseCase = container.resolve(UpdateProductUseCase);

      const response = await updateProductUseCase.execute({
        product_id: id,
        name,
        stock,
        price,
        categoryId,
      });

      if (response.isRight()) {
        return updated(response.value);
      }

      if (
        response.value instanceof ProductAlreadyExistsError ||
        response.value instanceof CategoryNotFoundError
      ) {
        return forbidden(response.value.message);
      }

      return badRequest(response.value.message);
    } catch (error) {
      return serverError(error);
    }
  }
}
