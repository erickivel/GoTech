import "reflect-metadata";
import "../../../container";

import { PlaceOrderController } from "../../../controllers/orders/PlaceOrderController";
import { MiddyMiddleware } from "../utils/commonMiddleware";

const PlaceOrder = async (event: any) => {
  const placeOrderController = new PlaceOrderController();

  const response = await placeOrderController.handle(event);

  return {
    statusCode: response.statusCode,
    body: JSON.stringify(response.body)
  };
};

export const handle = MiddyMiddleware(PlaceOrder);