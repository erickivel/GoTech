import "reflect-metadata";
import "../../../container";

import { ListOrdersByUserController } from "../../../controllers/orders/ListOrdersByUserController";
import { MiddyMiddleware } from "../utils/commonMiddleware";

const ListOrdersByUser = async (event: any) => {
  const listOrdersByUserController = new ListOrdersByUserController();

  console.log(event)

  const response = await listOrdersByUserController.handle(event);

  return {
    statusCode: response.statusCode,
    body: JSON.stringify(response.body)
  };
};

export const handle = MiddyMiddleware(ListOrdersByUser);