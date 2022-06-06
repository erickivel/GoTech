import crypto from 'crypto';

import { Either, left, right } from '../../../logic/Either';
import { InvalidProductNameError } from './errors/InvalidProductNameError';
import { InvalidProductPriceError } from './errors/InvalidProductPriceError';
import { InvalidProductStockError } from './errors/InvalidProductStockError';

type ProductProps = {
  id?: string;
  name: string;
  price: number;
  stock: number;
  categoryId?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class Product {
  public readonly id: string;
  public readonly name: string;
  public readonly price: number;
  public readonly stock: number;
  public readonly categoryId: string | null;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  private constructor(props: ProductProps) {
    this.id = props.id || crypto.randomUUID();
    this.name = props.name;
    this.price = props.price;
    this.stock = props.stock;
    this.categoryId = props.categoryId || null;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  };

  static create(
    props: ProductProps
  ): Either<
    | InvalidProductNameError
    | InvalidProductStockError
    | InvalidProductPriceError,
    Product
  > {
    const validate = Product.validate(props);

    if (validate.isLeft()) {
      return left(validate.value);
    };

    const product = new Product(props);

    return right(product);
  };

  public static validate(
    props: ProductProps
  ): Either<
    | InvalidProductNameError
    | InvalidProductStockError
    | InvalidProductPriceError,
    true
  > {
    const { name, stock, price } = props;

    if (!name || name.trim().length > 255 || name.trim().length < 2) {
      return left(new InvalidProductNameError(name));
    };

    if (!Number.isInteger(Number(stock)) || Number(stock) < 0) {
      return left(new InvalidProductStockError(stock));
    };

    let [, decimalPlaces] = String(price).split(".");

    decimalPlaces = decimalPlaces === undefined ? "0" : decimalPlaces;

    if (decimalPlaces.length > 2 || Number(price) < 0) {
      return left(new InvalidProductPriceError(price))
    };

    return right(true);
  };
};