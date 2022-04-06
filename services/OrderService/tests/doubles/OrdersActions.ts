import { inject, injectable } from "tsyringe";

import { IOrderData } from "../../src/useCases/orders/ports/IOrderData";
import { IOrdersRepository } from "../../src/useCases/orders/ports/IOrdersRepository";

@injectable()
export class OrdersActions {
  constructor(
    @inject("OrdersRepository")
    private ordersRepository: IOrdersRepository,
  ) { }

  async create(data: IOrderData): Promise<IOrderData> {
    const order = await this.ordersRepository.create(data);

    return order;
  };
};