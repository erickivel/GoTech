import "reflect-metadata";
import "../../../container";

import { CreateProductController } from "../../../controllers/products/CreateProductController";
import { MiddyMiddleware } from "../utils/commonMiddleware";

const CreateProduct = async (event: any) => {
  const createProductController = new CreateProductController();

  const response = await createProductController.handle(event);

  return {
    statusCode: response.statusCode,
    body: JSON.stringify(response.body)
  };
};

export const handle = MiddyMiddleware(CreateProduct);