import { inject, injectable } from 'tsyringe';

import { Either, right } from "../../logic/Either";

import { IOrderData } from './ports/IOrderData';
import { IOrdersRepository } from './ports/IOrdersRepository';

interface IRequest {
  userId: string;
};

@injectable()
export class ListOrdersByUserUseCase {
  constructor(
    @inject("OrdersRepository")
    private ordersRepository: IOrdersRepository,
  ) { }

  async execute({ userId }: IRequest): Promise<
    Either<null, IOrderData[]>
  > {
    const orders = await this.ordersRepository.filterByUserId(userId);

    return right(orders);
  };
};
