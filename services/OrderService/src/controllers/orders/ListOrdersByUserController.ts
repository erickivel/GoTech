import { container } from "tsyringe";

import { ListOrdersByUserUseCase } from "../../useCases/orders/ListOrdersByUserUseCase";
import { IController } from "../ports/IController";
import { IHttpResponse } from "../ports/IHttpResponse";
import { IServerlessHttpRequest } from "../ports/IServerlessHttpRequest";
import { ok, serverError, unauthorized } from "../utils/HttpResponses";

export class ListOrdersByUserController implements IController {
  async handle(request: IServerlessHttpRequest): Promise<IHttpResponse> {
    try {
      const authorizer = request.requestContext.authorizer

      if (!authorizer?.user || !authorizer.user?.id) {
        return unauthorized("User is not authenticated!");
      };

      const listOrdersByUserUseCase = container.resolve(ListOrdersByUserUseCase);

      const response = await listOrdersByUserUseCase.execute({ userId: authorizer.user.id });

      return ok(response.value);
    } catch (error) {
      console.error(error);
      return serverError(error);
    };
  };
};