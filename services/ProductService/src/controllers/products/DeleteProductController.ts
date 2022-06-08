import { container } from "tsyringe";

import { DeleteProductUseCase } from "../../useCases/products/DeleteProductUseCase";
import { MissingParamError } from "../errors/MissingParamError";
import { IController } from "../ports/IController";
import { IHttpResponse } from "../ports/IHttpResponse";
import { IServerlessHttpRequest } from "../ports/IServerlessHttpRequest";
import { badRequest, forbidden, ok, serverError, unauthorized } from "../utils/HttpResponses";

export class DeleteProductController implements IController {
  async handle(request: IServerlessHttpRequest): Promise<IHttpResponse> {
    try {
      const authorizer = request.requestContext.authorizer;

      if (!authorizer?.user || !authorizer.user?.id) {
        return unauthorized("User is not authenticated!");
      };

      if (!request.pathParameters.id) {
        return badRequest(new MissingParamError("product id").message);
      }

      const { id } = request.pathParameters;

      const deleteProductUseCase = container.resolve(DeleteProductUseCase);

      const response = await deleteProductUseCase.execute({ product_id: id });

      if (response.isLeft()) {
        return forbidden(response.value.message);
      }

      return ok("Product deleted successfully!");
    } catch (error) {
      return serverError(error);
    }
  }
}