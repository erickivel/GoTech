import { inject, injectable } from "tsyringe";

import { Category } from "../../domain/entities/Category";
import { InvalidCategoryNameError } from "../../domain/entities/Category/errors/InvalidCategoryNameError";
import { Either, left, right } from "../../logic/Either";
import { CategoryAlreadyExistsError } from "./errors/CategoryAlreadyExistsError";
import { CategoryNotFoundError } from "./errors/CategoryNotFoundError";
import { ICategoriesRepository } from "./ports/ICategoriesRepository";
import { ICategoryData } from "./ports/ICategoryData";

interface IRequest {
  category_id: string;
  name: string;
};

@injectable()
export class UpdateCategoryUseCase {
  constructor(
    @inject("CategoriesRepository")
    private categoriesRepository: ICategoriesRepository
  ) { }

  async execute({
    category_id, name
  }: IRequest): Promise<
    Either<
      | CategoryNotFoundError
      | CategoryAlreadyExistsError
      | InvalidCategoryNameError,
      ICategoryData
    >
  > {
    const category = await this.categoriesRepository.findById(category_id);

    if (!category) {
      return left(new CategoryNotFoundError(category_id))
    };

    const categoryAlreadyExists = await this.categoriesRepository.findByName(name);

    if (categoryAlreadyExists && categoryAlreadyExists.id !== category.id) {
      return left(new CategoryAlreadyExistsError(name));
    };

    const paramsToUpdate = {
      id: category.id,
      name,
      createdAt: category.createdAt,
      updatedAt: new Date(),
    }

    const categoryOrError = Category.create(paramsToUpdate);

    if (categoryOrError.isLeft()) {
      return left(categoryOrError.value);
    };

    const categoryUpdated = await this.categoriesRepository.update(categoryOrError.value);

    return right(categoryUpdated);
  }
}