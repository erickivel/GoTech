import { inject, injectable } from "tsyringe";

import { Either, left, right } from "../../logic/Either";
import { CategoryNotFoundError } from "./errors/CategoryNotFoundError";
import { ICategoriesRepository } from "./ports/ICategoriesRepository";

interface IRequest {
  category_id: string;
};

@injectable()
export class DeleteCategoryUseCase {
  constructor(
    @inject("CategoriesRepository")
    private categoriesRepository: ICategoriesRepository
  ) { }

  async execute({ category_id }: IRequest): Promise<
    Either<CategoryNotFoundError, null>> {
    const category = await this.categoriesRepository.findById(category_id);

    if (!category) {
      return left(new CategoryNotFoundError(category_id))
    };

    await this.categoriesRepository.deleteOne(category_id);

    return right(null);
  }
}