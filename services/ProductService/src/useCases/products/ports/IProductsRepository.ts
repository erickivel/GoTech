import { IProductData } from "./IProductData";

export interface IProductsRepository {
  create(data: IProductData): Promise<IProductData>;
  findByName(name: string): Promise<IProductData | null>;
  findById(id: string): Promise<IProductData | null>;
  listAll(): Promise<IProductData[]>;
  updateStock(id: string, newStock: number): Promise<void>;
};
