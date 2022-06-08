import "reflect-metadata";
import "../../../container";

import { DeleteProductController } from "../../../controllers/products/DeleteProductController";
import { MiddyMiddleware } from "../utils/commonMiddleware";

const DeleteProduct = async (event: any) => {
  const deleteProductController = new DeleteProductController();

  const response = await deleteProductController.handle(event);

  return {
    statusCode: response.statusCode,
    body: JSON.stringify(response.body)
  };
};

export const handle = MiddyMiddleware(DeleteProduct);