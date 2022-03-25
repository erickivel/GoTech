import { ICategoryData } from "./ICategoryData";

export interface ICategoriesRepository {
  create(data: ICategoryData): Promise<ICategoryData>;
  findByName(name: string): Promise<ICategoryData | null>;
};