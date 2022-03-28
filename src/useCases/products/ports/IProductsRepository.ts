import { IProductData } from "./IProductData";

export interface IProductsRepository {
  create(data: IProductData): Promise<IProductData>;
  findByName(name: string): Promise<IProductData | null>;
};