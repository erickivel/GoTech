import { ICategoriesRepository } from "../../../src/useCases/categories/ports/ICategoriesRepository";
import { ICategoryData } from "../../../src/useCases/categories/ports/ICategoryData";

export class CategoriesRepositoryInMemory implements ICategoriesRepository {
  categories: ICategoryData[] = [];

  async create(data: ICategoryData): Promise<ICategoryData> {
    this.categories.push(data);

    return data;
  };

  async findByName(name: string): Promise<ICategoryData | null> {
    const category = this.categories.find(category => category.name === name);

    return category || null;
  };

  async listAll(): Promise<ICategoryData[]> {
    return this.categories;
  };

  async findById(id: string): Promise<ICategoryData | null> {
    const category = this.categories.find(category => category.id === id);

    return category || null;
  };

  async update(data: ICategoryData): Promise<ICategoryData> {
    const categoryIndex = this.categories.findIndex(category => category.id === data.id);

    this.categories[categoryIndex] = data;

    return this.categories[categoryIndex];
  };

  async deleteOne(id: string): Promise<void> {
    const categoryIndex = this.categories.findIndex(category => category.id === id);

    this.categories.splice(categoryIndex, 1);
  }
}