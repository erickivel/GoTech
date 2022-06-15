import { IProductData } from "../../../src/useCases/products/ports/IProductData";
import { IProductsRepository } from "../../../src/useCases/products/ports/IProductsRepository";

export class ProductsRepositoryInMemory implements IProductsRepository {
  products: IProductData[] = [];

  async create(data: IProductData): Promise<IProductData> {
    this.products.push(data);

    return data;
  }

  async findByName(name: string): Promise<IProductData | null> {
    const product = this.products.find((product) => product.name === name);

    return product || null;
  }

  async listAll(): Promise<IProductData[]> {
    return this.products;
  }

  async findById(id: string): Promise<IProductData | null> {
    const product = this.products.find((product) => product.id === id);

    return product || null;
  }

  async updateStock(id: string, newStock: number): Promise<void> {
    const findIndex = this.products.findIndex((product) => product.id === id);

    this.products[findIndex].stock = newStock;
  }

  async deleteOne(id: string): Promise<void> {
    const productIndex = this.products.findIndex(
      (product) => product.id === id
    );

    this.products.splice(productIndex, 1);
  }

  async update(data: IProductData): Promise<IProductData> {
    const productIndex = this.products.findIndex(
      (product) => product.id === data.id
    );

    this.products[productIndex] = data;

    return this.products[productIndex];
  }
}

