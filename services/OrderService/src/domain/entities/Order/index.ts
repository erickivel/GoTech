import crypto from 'crypto';

import { Either, left, right } from '../../../logic/Either';
import { InvalidOrderTotalError } from './errors/InvalidOrderTotalError';

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

type OrderProps = {
  id?: string;
  user: User;
  products: Product[];
  total: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export class Order {
  public readonly id: string;
  public readonly user: User;
  public readonly products: Product[];
  public readonly total: number;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  private constructor(props: OrderProps) {
    this.id = props.id || crypto.randomUUID();
    this.user = props.user;
    this.products = props.products;
    this.total = props.total;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  };

  static create(
    props: OrderProps
  ): Either<
    | InvalidOrderTotalError,
    Order
  > {
    const validate = Order.validate(props);

    if (validate.isLeft()) {
      return left(validate.value);
    };

    const order = new Order(props);

    return right(order);
  };

  public static validate(
    props: OrderProps
  ): Either<
    | InvalidOrderTotalError,
    true
  > {
    const { total } = props;

    let [, decimalPlaces] = String(total).split(".");

    decimalPlaces = decimalPlaces === undefined ? "0" : decimalPlaces;

    if (decimalPlaces.length > 2 || Number(total) < 0) {
      return left(new InvalidOrderTotalError(total))
    };

    return right(true);
  };
};