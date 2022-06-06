import { InvalidCategoryNameError } from "../../../src/domain/entities/Category/errors/InvalidCategoryNameError";
import { CategoryAlreadyExistsError } from "../../../src/useCases/categories/errors/CategoryAlreadyExistsError";
import { CategoryNotFoundError } from "../../../src/useCases/categories/errors/CategoryNotFoundError";
import { UpdateCategoryUseCase } from "../../../src/useCases/categories/UpdateCategoryUseCase";
import { CategoriesRepositoryInMemory } from "../../doubles/repositories/CategoriesRepositoryInMemory";

describe("Update Category UseCase", () => {
  let categoriesRepositoryInMemory: CategoriesRepositoryInMemory;
  let updateCategoryUseCase: UpdateCategoryUseCase;

  beforeEach(() => {
    categoriesRepositoryInMemory = new CategoriesRepositoryInMemory()
    updateCategoryUseCase = new UpdateCategoryUseCase(categoriesRepositoryInMemory);
  });

  it("should update a category", async () => {
    const date = new Date("8-25-2020");

    await categoriesRepositoryInMemory.create({
      id: "fake-id-1",
      name: "Category 1",
      createdAt: date,
      updatedAt: date,
    });

    const categoryOrError = await updateCategoryUseCase.execute({
      category_id: "fake-id-1",
      name: "new name"
    });

    const expectedResponse = {
      id: "fake-id-1",
      name: "new name",
      createdAt: date,
    };

    if (categoryOrError.isLeft()) {
      throw new Error("Update Category UseCase Error");
    }

    expect(categoryOrError.isRight()).toBeTruthy();
    expect(categoryOrError.value).toMatchObject(expectedResponse);
    expect(categoryOrError.value.updatedAt).not.toEqual(date);
  });

  it("should not update a category that doesn't exist", async () => {
    const dateNow = new Date();

    await categoriesRepositoryInMemory.create({
      id: "fake-id-1",
      name: "Category 1",
      createdAt: dateNow,
      updatedAt: dateNow,
    });

    const invalidId = "invalid-id";

    const categories = await updateCategoryUseCase.execute({
      category_id: invalidId,
      name: "new name"
    });

    expect(categories.isLeft()).toBeTruthy();
    expect(categories.value).toEqual(new CategoryNotFoundError(invalidId));
  });

  it("should not update a category with an already taken name", async () => {
    const dateNow = new Date();

    await categoriesRepositoryInMemory.create({
      id: "fake-id-1",
      name: "Category 1",
      createdAt: dateNow,
      updatedAt: dateNow,
    });

    await categoriesRepositoryInMemory.create({
      id: "fake-id-2",
      name: "Category 2",
      createdAt: dateNow,
      updatedAt: dateNow,
    });

    const categories = await updateCategoryUseCase.execute({
      category_id: "fake-id-2",
      name: "Category 1"
    });

    expect(categories.isLeft()).toBeTruthy();
    expect(categories.value).toEqual(new CategoryAlreadyExistsError("Category 1"));
  });

  it("should not update a category with an invalid name", async () => {
    const dateNow = new Date();

    await categoriesRepositoryInMemory.create({
      id: "fake-id-1",
      name: "Category 1",
      createdAt: dateNow,
      updatedAt: dateNow,
    });

    const invalidName = "a";

    const categories = await updateCategoryUseCase.execute({
      category_id: "fake-id-1",
      name: invalidName,
    });

    expect(categories.isLeft()).toBeTruthy();
    expect(categories.value).toEqual(new InvalidCategoryNameError(invalidName));
  });
});