import { DeleteCategoryUseCase } from "../../../src/useCases/categories/DeleteCategoryUseCase";
import { CategoryNotFoundError } from "../../../src/useCases/categories/errors/CategoryNotFoundError";
import { CategoriesRepositoryInMemory } from "../../doubles/repositories/CategoriesRepositoryInMemory";

describe("Delete Category UseCase", () => {
  let categoriesRepositoryInMemory: CategoriesRepositoryInMemory;
  let deleteCategoryUseCase: DeleteCategoryUseCase;

  beforeEach(() => {
    categoriesRepositoryInMemory = new CategoriesRepositoryInMemory()
    deleteCategoryUseCase = new DeleteCategoryUseCase(categoriesRepositoryInMemory);
  });

  it("should delete a category", async () => {
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

    const categoryOrError = await deleteCategoryUseCase.execute({ category_id: "fake-id-1" });

    const categories = await categoriesRepositoryInMemory.listAll();

    const expectedResponse = [
      {
        id: "fake-id-2",
        name: "Category 2",
        createdAt: dateNow,
        updatedAt: dateNow,
      }
    ];

    expect(categoryOrError.isRight()).toBeTruthy();
    expect(categoryOrError.value).toEqual(null);
    expect(categories).toEqual(expectedResponse);
  });

  it("should not delete a category if it doesn't exist", async () => {
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

    const inexistentId = "inexistent-id"

    const categoryOrError = await deleteCategoryUseCase.execute({ category_id: inexistentId });

    const categories = await categoriesRepositoryInMemory.listAll();

    const expectedResponse = [
      {
        id: "fake-id-1",
        name: "Category 1",
        createdAt: dateNow,
        updatedAt: dateNow,
      },
      {
        id: "fake-id-2",
        name: "Category 2",
        createdAt: dateNow,
        updatedAt: dateNow,
      }
    ];

    expect(categoryOrError.isLeft()).toBeTruthy();
    expect(categoryOrError.value).toEqual(new CategoryNotFoundError(inexistentId));
    expect(categories).toEqual(expectedResponse);
  });
});