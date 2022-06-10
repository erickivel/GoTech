import "reflect-metadata";
import "../../../container";

import { DeleteProductController } from "../../../controllers/products/DeleteProductController";
import { MiddyMiddleware } from "../utils/commonMiddleware";

const DeleteProduct = async (event: any) => {
  const deleteProductController = new DeleteProductController();

  console.log("Event:", event);

  const response = await deleteProductController.handle(event);

  console.log("Response:", response);

  return {
    statusCode: response.statusCode,
    body: JSON.stringify(response.body)
  };
};

export const handle = MiddyMiddleware(DeleteProduct);