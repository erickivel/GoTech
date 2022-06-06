import crypto from 'crypto';

import { Either, left, right } from '../../../logic/Either';
import { InvalidCategoryNameError } from './errors/InvalidCategoryNameError';

type CategoryProps = {
  id?: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Category {
  public readonly id: string;
  public readonly name: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: CategoryProps) {
    this.id = props.id || crypto.randomUUID();
    this.name = props.name;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  };

  static create(
    props: CategoryProps
  ): Either<InvalidCategoryNameError, Category> {
    const validate = Category.validate(props)

    if (validate.isLeft()) {
      return left(validate.value);
    };

    const category = new Category(props);

    return right(category);
  };

  public static validate(props: CategoryProps): Either<InvalidCategoryNameError, true> {
    const { name } = props;

    if (!name || name.trim().length > 255 || name.trim().length < 2) {
      return left(new InvalidCategoryNameError(name));
    };

    return right(true);
  };
};