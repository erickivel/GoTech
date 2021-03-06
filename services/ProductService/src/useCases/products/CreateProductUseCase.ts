import { inject, injectable } from 'tsyringe';

import { Product } from '../../domain/entities/Product';
import { InvalidProductNameError } from '../../domain/entities/Product/errors/InvalidProductNameError';
import { InvalidProductPriceError } from '../../domain/entities/Product/errors/InvalidProductPriceError';
import { InvalidProductStockError } from '../../domain/entities/Product/errors/InvalidProductStockError';
import { Either, left, right } from "../../logic/Either";
import { CategoryNotFoundError } from '../categories/errors/CategoryNotFoundError';
import { ICategoriesRepository } from '../categories/ports/ICategoriesRepository';
import { ProductAlreadyExistsError } from './errors/ProductAlreadyExistsError';
import { IProductData } from './ports/IProductData';
import { IProductsRepository } from './ports/IProductsRepository';


interface IRequest {
  name: string;
  stock: number;
  price: number;
  categoryId: string;
};

@injectable()
export class CreateProductUseCase {
  constructor(
    @inject("ProductsRepository")
    private productsRepository: IProductsRepository,
    @inject("CategoriesRepository")
    private categoriesRepository: ICategoriesRepository
  ) { }

  async execute({
    name, stock, price, categoryId
  }: IRequest): Promise<
    Either<
      | ProductAlreadyExistsError
      | InvalidProductNameError
      | InvalidProductStockError
      | InvalidProductPriceError
      | CategoryNotFoundError,
      IProductData
    >
  > {
    const productExists = await this.productsRepository.findByName(name);

    if (productExists) {
      return left(new ProductAlreadyExistsError(name));
    };

    const categoryExists = await this.categoriesRepository.findById(categoryId);

    if (!categoryExists) {
      return left(new CategoryNotFoundError(categoryId));
    }

    const productOrError = Product.create({
      name,
      stock,
      price,
      categoryId,
    });

    if (productOrError.isLeft()) {
      return left(productOrError.value);
    }

    const product = await this.productsRepository.create(productOrError.value);

    return right(product);
  }
}
