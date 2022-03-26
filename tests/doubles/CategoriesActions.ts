import { inject, injectable } from "tsyringe";

import { ICategoriesRepository } from "../../src/useCases/categories/ports/ICategoriesRepository";
import { ICategoryData } from "../../src/useCases/categories/ports/ICategoryData";

@injectable()
export class CategoriesActions {
  constructor(
    @inject("CategoriesRepository")
    private categoriesRepository: ICategoriesRepository,
  ) { }

  async create(data: ICategoryData): Promise<ICategoryData> {
    const category = await this.categoriesRepository.create(data);

    return category;
  };

  async findByName(name: string): Promise<ICategoryData | null> {
    const category = await this.categoriesRepository.findByName(name);

    return category;
  }
};