import { container } from "tsyringe";

import { PlaceOrderUseCase } from "../../useCases/orders/PlaceOrderUseCase";
import { MissingParamError } from "../errors/MissingParamError";
import { IController } from "../ports/IController";
import { IHttpResponse } from "../ports/IHttpResponse";
import { IServerlessHttpRequest } from "../ports/IServerlessHttpRequest";
import { badRequest, created, forbidden, serverError, unauthorized } from "../utils/HttpResponses";
import { IsRequiredParamsMissing } from "../utils/IsRequiredParamsMissing";

export class PlaceOrderController implements IController {
  requiredParams = ["products"];

  async handle(request: any): Promise<IHttpResponse> {
    try {
      const authorizer = request.requestContext.authorizer.lambda;

      if (!authorizer?.user || !authorizer.user?.id) {
        return unauthorized("User is not authenticated!");
      };

      const requiredParamsMissing = IsRequiredParamsMissing(request.body, this.requiredParams)

      if (requiredParamsMissing) {
        return badRequest(new MissingParamError(requiredParamsMissing).message);
      };

      const { products } = request.body;

      const placeOrderUseCase = container.resolve(PlaceOrderUseCase);

      const user = {
        id: authorizer.user.id,
        name: authorizer.user.name,
        email: authorizer.user.email,
      };

      const response = await placeOrderUseCase.execute({ products, user });

      if (response.isLeft()) {
        return forbidden(response.value.message);
      }

      return created(response.value);
    } catch (error) {
      console.error(error);
      return serverError(error);
    };
  };
};