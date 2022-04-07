import { IOrderData } from "../../../src/useCases/orders/ports/IOrderData";
import { IOrdersRepository } from "../../../src/useCases/orders/ports/IOrdersRepository";

export class OrdersRepositoryInMemory implements IOrdersRepository {
  orders: IOrderData[] = [];

  async create(data: IOrderData): Promise<IOrderData> {
    this.orders.push(data);

    return data;
  };

  async filterByUserId(userId: string): Promise<IOrderData[]> {
    const orders = this.orders.filter(order => order.user.id === userId);

    return orders;
  }
};