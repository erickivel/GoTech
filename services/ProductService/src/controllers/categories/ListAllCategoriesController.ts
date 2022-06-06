import { container } from "tsyringe";

import { ListAllCategoriesUseCase } from "../../useCases/categories/ListAllCategoriesUseCase";
import { IController } from "../ports/IController";
import { IHttpRequest } from "../ports/IHttpRequest";
import { IHttpResponse } from "../ports/IHttpResponse";
import { ok, serverError } from "../utils/HttpResponses";

export class ListAllCategoriesController implements IController {
  async handle(request: IHttpRequest): Promise<IHttpResponse> {
    try {
      const listAllCategoriesUseCase = container.resolve(ListAllCategoriesUseCase);

      const response = await listAllCategoriesUseCase.execute();

      return ok(response.value);
    } catch (error) {
      return serverError(error);
    };
  };
};