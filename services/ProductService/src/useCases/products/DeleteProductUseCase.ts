import { inject, injectable } from "tsyringe";
import { Either, left, right } from "../../logic/Either";
import { ProductNotFoundError } from "./errors/ProductNotFoundError";
import { IProductsRepository } from "./ports/IProductsRepository";

interface IRequest {
  product_id: string;
}

@injectable()
export class DeleteProductUseCase {
  constructor(
    @inject("ProductsRepository")
    private productsRepository: IProductsRepository
  ) { }

  async execute({ product_id }: IRequest): Promise<
    Either<ProductNotFoundError, null>> {
    const product = await this.productsRepository.findById(product_id);

    if (!product) {
      return left(new ProductNotFoundError(product_id));
    }

    await this.productsRepository.deleteOne(product_id);

    return right(null);
  }
}