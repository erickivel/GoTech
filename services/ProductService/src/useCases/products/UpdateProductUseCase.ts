import { inject, injectable } from "tsyringe";
import { Product } from "../../domain/entities/Product";
import { InvalidProductNameError } from "../../domain/entities/Product/errors/InvalidProductNameError";
import { InvalidProductPriceError } from "../../domain/entities/Product/errors/InvalidProductPriceError";
import { InvalidProductStockError } from "../../domain/entities/Product/errors/InvalidProductStockError";
import { Either, left, right } from "../../logic/Either";
import { CategoryNotFoundError } from "../categories/errors/CategoryNotFoundError";
import { ICategoriesRepository } from "../categories/ports/ICategoriesRepository";
import { ProductAlreadyExistsError } from "./errors/ProductAlreadyExistsError";
import { ProductNotFoundError } from "./errors/ProductNotFoundError";
import { IProductData } from "./ports/IProductData";
import { IProductsRepository } from "./ports/IProductsRepository";

interface IRequest {
  product_id: string;
  name: string;
  stock: number;
  price: number;
  categoryId: string | null;
}

@injectable()
export class UpdateProductUseCase {
  constructor(
    @inject("ProductsRepository")
    private productsRepository: IProductsRepository,
    @inject("CategoriesRepository")
    private categoriesRepository: ICategoriesRepository
  ) {}

  async execute({
    product_id,
    name,
    stock,
    price,
    categoryId,
  }: IRequest): Promise<
    Either<
      | ProductNotFoundError
      | ProductAlreadyExistsError
      | CategoryNotFoundError
      | InvalidProductNameError
      | InvalidProductStockError
      | InvalidProductPriceError,
      IProductData
    >
  > {
    const product = await this.productsRepository.findById(product_id);

    if (!product) {
      return left(new ProductNotFoundError(product_id));
    }

    const productAlreadyExists = await this.productsRepository.findByName(name);

    if (productAlreadyExists && productAlreadyExists.id !== product.id) {
      return left(new ProductAlreadyExistsError(name));
    }

    if (categoryId) {
      const categoryExists = await this.categoriesRepository.findById(
        categoryId
      );

      if (!categoryExists) {
        return left(new CategoryNotFoundError(categoryId));
      }
    }

    const paramsToUpdate = {
      id: product.id,
      name,
      stock,
      price,
      categoryId: categoryId ? categoryId : undefined,
      createdAt: product.createdAt,
      updatedAt: new Date(),
    };

    const productOrError = Product.create(paramsToUpdate);

    if (productOrError.isLeft()) {
      return left(productOrError.value);
    }

    const productUpdated = await this.productsRepository.update(
      productOrError.value
    );

    return right(productUpdated);
  }
}
