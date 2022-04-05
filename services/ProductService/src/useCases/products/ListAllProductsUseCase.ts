import { inject, injectable } from 'tsyringe';

import { Either, right } from "../../logic/Either";
import { IProductData } from './ports/IProductData';
import { IProductsRepository } from './ports/IProductsRepository';


@injectable()
export class ListAllProductsUseCase {
  constructor(
    @inject("ProductsRepository")
    private productsRepository: IProductsRepository
  ) { }

  async execute(): Promise<Either<void, IProductData[]>> {
    const categories = await this.productsRepository.listAll();

    return right(categories);
  }
}
