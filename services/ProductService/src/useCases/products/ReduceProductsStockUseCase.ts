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
    let productNotFoundError = {
      boolean: false,
      product: {
        id: "",
      },
    };
    let productInsufficientStockError = {
      boolean: false,
      product: {
        id: "",
      },
    };

    async function handleProducts(productsRepository: IProductsRepository) {
      productsInfos.forEach(async product => {
        const productExists = await productsRepository.findById(product.id);

        if (productNotFoundError.boolean || productInsufficientStockError.boolean) {
          return;
        }

        if (productExists === null) {
          productNotFoundError.boolean = true;
          productNotFoundError.product.id = product.id;
          return;
        };

        if (product.amount > productExists.stock) {
          productInsufficientStockError.boolean = true;
          productInsufficientStockError.product.id = product.id;
          return;
        };

        const stockUpdated = Number(productExists.stock) - Number(product.amount);

        await productsRepository.updateStock(product.id, stockUpdated);
      });
    }

    await handleProducts(this.productsRepository);

    if (productNotFoundError.boolean) {
      return left(new ProductNotFoundError(productNotFoundError.product.id))
    };

    if (productInsufficientStockError.boolean) {
      return left(new ProductInsufficientStockError(productInsufficientStockError.product.id));
    };

    return right(null);
  }
}
