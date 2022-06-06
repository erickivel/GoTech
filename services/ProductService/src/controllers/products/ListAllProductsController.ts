import { container } from "tsyringe";

import { ListAllProductsUseCase } from "../../useCases/products/ListAllProductsUseCase";
import { IController } from "../ports/IController";
import { IHttpRequest } from "../ports/IHttpRequest";
import { IHttpResponse } from "../ports/IHttpResponse";
import { ok, serverError } from "../utils/HttpResponses";

export class ListAllProductsController implements IController {
  async handle(request: IHttpRequest): Promise<IHttpResponse> {
    try {
      const listAllProductsUseCase = container.resolve(ListAllProductsUseCase);

      const response = await listAllProductsUseCase.execute();

      return ok(response.value);
    } catch (error) {
      return serverError(error);
    };
  };
};