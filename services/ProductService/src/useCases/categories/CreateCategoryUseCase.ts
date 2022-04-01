import { inject, injectable } from 'tsyringe';

import { Category } from '../../domain/entities/Category';
import { InvalidCategoryNameError } from '../../domain/entities/Category/errors/InvalidCategoryNameError';
import { Either, left, right } from "../../logic/Either";
import { CategoryAlreadyExistsError } from './errors/CategoryAlreadyExistsError';
import { ICategoriesRepository } from './ports/ICategoriesRepository';
import { ICategoryData } from './ports/ICategoryData';


interface IRequest {
  name: string;
}

@injectable()
export class CreateCategoryUseCase {
  constructor(
    @inject("CategoriesRepository")
    private categoriesRepository: ICategoriesRepository
  ) { }

  async execute({
    name,
  }: IRequest): Promise<
    Either<
      | CategoryAlreadyExistsError
      | InvalidCategoryNameError,
      ICategoryData
    >
  > {
    const categoryExists = await this.categoriesRepository.findByName(name);

    if (categoryExists) {
      return left(new CategoryAlreadyExistsError(name));
    }

    const categoryOrError = Category.create({
      name,
    });

    if (categoryOrError.isLeft()) {
      return left(categoryOrError.value);
    }

    const category = await this.categoriesRepository.create(categoryOrError.value);

    return right(category);
  }
}
