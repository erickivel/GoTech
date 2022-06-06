import "reflect-metadata";
import "../../../container";
import { ReduceProductsStockController } from "../../../controllers/products/ReduceProductsStockController";

import { MiddyMiddleware } from "../utils/commonMiddleware";

const ReduceProductsStock = async (event: any) => {
  const reduceProductsStockController = new ReduceProductsStockController();

  const response = await reduceProductsStockController.handle(event);

  return {
    statusCode: response.statusCode,
    body: JSON.stringify(response.body)
  };
};

export const handle = MiddyMiddleware(ReduceProductsStock);