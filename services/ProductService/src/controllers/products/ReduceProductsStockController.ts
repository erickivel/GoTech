import { container } from "tsyringe";

import { IController } from "../ports/IController";
import { IHttpResponse } from "../ports/IHttpResponse";
import { IServerlessHttpRequest } from "../ports/IServerlessHttpRequest";
import { badRequest, forbidden, ok, serverError } from "../utils/HttpResponses";
import { ReduceProductsStockUseCase } from "../../useCases/products/ReduceProductsStockUseCase";

export class ReduceProductsStockController implements IController {
  async handle(request: IServerlessHttpRequest): Promise<IHttpResponse> {
    try {
      if (!request.Records) {
        return badRequest("Message not received!");
      };

      const messageInString = request.Records[0].body;

      const messageParsed = JSON.parse(messageInString);

      const reduceProductsStockUseCase = container.resolve(ReduceProductsStockUseCase);

      const response = await reduceProductsStockUseCase.execute({ productsInfos: messageParsed.products });

      if (response.isRight()) {
        return ok("Products Stock Updated!");
      };

      return forbidden(response.value.message);
    } catch (error) {
      return serverError(error);
    };
  };
};