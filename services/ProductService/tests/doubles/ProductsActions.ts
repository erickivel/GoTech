import { inject, injectable } from "tsyringe";

import { IProductData } from "../../src/useCases/products/ports/IProductData";
import { IProductsRepository } from "../../src/useCases/products/ports/IProductsRepository";

@injectable()
export class ProductsActions {
  constructor(
    @inject("ProductsRepository")
    private productsRepository: IProductsRepository,
  ) { }

  async create(data: IProductData): Promise<IProductData> {
    const product = await this.productsRepository.create(data);

    return product;
  };
};