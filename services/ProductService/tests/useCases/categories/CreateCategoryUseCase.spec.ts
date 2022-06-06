import { InvalidCategoryNameError } from "../../../src/domain/entities/Category/errors/InvalidCategoryNameError";
import { CreateCategoryUseCase } from "../../../src/useCases/categories/CreateCategoryUseCase";
import { CategoryAlreadyExistsError } from "../../../src/useCases/categories/errors/CategoryAlreadyExistsError";
import { CategoriesRepositoryInMemory } from "../../doubles/repositories/CategoriesRepositoryInMemory";

describe("Create Category UseCase", () => {
  let categoriesRepositoryInMemory: CategoriesRepositoryInMemory;
  let createCategoryUseCase: CreateCategoryUseCase;

  beforeEach(() => {
    categoriesRepositoryInMemory = new CategoriesRepositoryInMemory()
    createCategoryUseCase = new CreateCategoryUseCase(categoriesRepositoryInMemory);
  });

  it("should create a category", async () => {
    const category = {
      name: "New Category",
    };

    const categoryOrError = await createCategoryUseCase.execute(category);

    const createdCategory = await categoriesRepositoryInMemory.findByName(category.name);

    expect(categoryOrError.value).toEqual(createdCategory);
    expect(categoryOrError.isRight).toBeTruthy();
    expect(categoryOrError.value).toHaveProperty("id");
    expect(categoryOrError.value).toHaveProperty("name");
    expect(categoryOrError.value).toHaveProperty("createdAt");
    expect(categoryOrError.value).toHaveProperty("updatedAt");
  });

  it("should not create a category if the name already exists", async () => {
    const categoryName = "New Category";

    const category = {
      name: categoryName,
    };

    await createCategoryUseCase.execute(category);
    const categoryOrError = await createCategoryUseCase.execute(category);

    expect(categoryOrError.isLeft()).toBeTruthy();
    expect(categoryOrError.value).toEqual(new CategoryAlreadyExistsError(categoryName))
  });

  it("should not create a category if the name is invalid", async () => {
    const invalidName = "a";

    const category = {
      name: invalidName,
    };

    await createCategoryUseCase.execute(category);
    const categoryOrError = await createCategoryUseCase.execute(category);

    expect(categoryOrError.isLeft()).toBeTruthy();
    expect(categoryOrError.value).toEqual(new InvalidCategoryNameError(invalidName))
  });
});