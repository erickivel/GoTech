import { IProductData } from "../../../src/useCases/products/ports/IProductData";
import { IProductsRepository } from "../../../src/useCases/products/ports/IProductsRepository";

export class ProductsRepositoryInMemory implements IProductsRepository {
  products: IProductData[] = [];

  async create(data: IProductData): Promise<IProductData> {
    this.products.push(data);

    return data;
  };

  async findByName(name: string): Promise<IProductData | null> {
    const product = this.products.find(product => product.name === name);

    return product || null;
  };
};