import { ICategoryData } from "./ICategoryData";

export interface ICategoriesRepository {
  create(data: ICategoryData): Promise<ICategoryData>;
  findByName(name: string): Promise<ICategoryData | null>;
  findById(id: string): Promise<ICategoryData | null>;
  listAll(): Promise<ICategoryData[]>;
  update(data: ICategoryData): Promise<ICategoryData>;
};