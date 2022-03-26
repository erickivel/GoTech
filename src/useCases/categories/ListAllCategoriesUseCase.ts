import { inject, injectable } from 'tsyringe';

import { Either, right } from "../../logic/Either";
import { ICategoriesRepository } from './ports/ICategoriesRepository';
import { ICategoryData } from './ports/ICategoryData';


@injectable()
export class ListAllCategoriesUseCase {
  constructor(
    @inject("CategoriesRepository")
    private categoriesRepository: ICategoriesRepository
  ) { }

  async execute(): Promise<Either<void, ICategoryData[]>> {
    const categories = await this.categoriesRepository.listAll();

    return right(categories);
  }
}
