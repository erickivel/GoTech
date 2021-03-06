import { inject, injectable } from 'tsyringe';

import { Either, left, right } from "../../logic/Either";

import { InvalidOrderTotalError } from '../../domain/entities/Order/errors/InvalidOrderTotalError';
import { IOrderData } from './ports/IOrderData';
import { IOrdersRepository } from './ports/IOrdersRepository';
import { Order } from '../../domain/entities/Order';
import { IMessagingAdapter } from './ports/IMessagingAdapter';

type User = {
  id: string;
  name: string;
  email: string;
}

type Product = {
  id: string;
  name: string;
  price: number;
  amount: number;
};

interface IRequest {
  user: User;
  products: Product[];
};

@injectable()
export class PlaceOrderUseCase {
  constructor(
    @inject("OrdersRepository")
    private ordersRepository: IOrdersRepository,

    @inject("MessagingAdapter")
    private messagingAdapter: IMessagingAdapter
  ) { }

  async execute({ user, products }: IRequest): Promise<
    Either<
      | InvalidOrderTotalError,
      IOrderData
    >
  > {
    const total = products.reduce((acc, product) => {
      return acc += (product.price * product.amount);
    }, 0)

    const orderOrError = Order.create({
      user,
      products,
      total: Number(total.toFixed(2)),
    });

    if (orderOrError.isLeft()) {
      return left(orderOrError.value);
    }

    const order = await this.ordersRepository.create(orderOrError.value);

    await this.messagingAdapter.sendMessage(JSON.stringify(
      {
        products: products.map(product => {
          return {
            id: product.id,
            amount: product.amount,
          }
        })
      }
    ));

    return right(order);
  };
};
