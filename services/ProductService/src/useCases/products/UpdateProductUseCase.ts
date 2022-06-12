import { inject, injectable } from "tsyringe";
import { left } from "../../logic/Either";
import { ProductNotFoundError } from "./errors/ProductNotFoundError";
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
    private productsRepository: IProductsRepository
  ) { }

  async execute({
    product_id,
    name,
    stock,
    price,
    categoryId
  }: IRequest) {
    const product = await this.productsRepository.findById(product_id);

    if (!product) {
      return left(new ProductNotFoundError(product_id))
    };

    const productAlreadyExists = await this.productsRepository.findByName(name);

    if (productAlreadyExists && categoryAlreadyExists.id !== category.id) {
      return left(new CategoryAlreadyExistsError(name));
    };

    const paramsToUpdate = {
      id: category.id,
      name,
      createdAt: category.createdAt,
      updatedAt: new Date(),
    }

    const categoryOrError = Category.create(paramsToUpdate);

    if (categoryOrError.isLeft()) {
      return left(categoryOrError.value);
    };

    const categoryUpdated = await this.categoriesRepository.update(categoryOrError.value);

    return right(categoryUpdated);

  }
}
