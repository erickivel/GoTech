import { inject, injectable } from 'tsyringe';

import { Either, Left, left, right } from "../../logic/Either";
import { ProductInsufficientStockError } from './errors/ProductInsufficientStockError';
import { ProductNotFoundError } from './errors/ProductNotFoundError';
import { IProductsRepository } from './ports/IProductsRepository';

type ProductInfo = {
  id: string
  amount: number;
}

interface IRequest {
  productsInfos: ProductInfo[];
}

@injectable()
export class ReduceProductsStockUseCase {
  constructor(
    @inject("ProductsRepository")
    private productsRepository: IProductsRepository
  ) { }

  async execute({ productsInfos }: IRequest): Promise<
    Either<
      | ProductNotFoundError
      | ProductInsufficientStockError,
      null
    >
  > {
    const products = await Promise.all(productsInfos.map(async product => {
      return await this.productsRepository.findById(product.id);
    }));

    for (const product of products) {
      if (product === null) {
        return left(new ProductNotFoundError());
      };

      const productInfo = productsInfos.find(productInfo => product.id === productInfo.id);

      if (!productInfo) {
        return left(new ProductNotFoundError(product.id))
      };

      if (productInfo.amount > product.stock) {
        return left(new ProductInsufficientStockError(product.id));
      };
    }

    await Promise.all(productsInfos.map(async product => {
      const productInRepository = products.find(p => p?.id === product.id);

      if (!productInRepository) {
        return left(new ProductNotFoundError(product.id))
      };

      const stockUpdated = Number(productInRepository?.stock) - Number(product.amount);

      return await this.productsRepository.updateStock(product.id, stockUpdated).then();
    }))

    return right(null);
  }
}