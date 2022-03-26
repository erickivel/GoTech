import { ListAllCategoriesUseCase } from "../../../src/useCases/categories/ListAllCategoriesUseCase";
import { CategoriesRepositoryInMemory } from "../../doubles/repositories/CategoriesRepositoryInMemory";

describe("List All Categories UseCase", () => {
  let categoriesRepositoryInMemory: CategoriesRepositoryInMemory;
  let listAllCategoriesUseCase: ListAllCategoriesUseCase;

  beforeEach(() => {
    categoriesRepositoryInMemory = new CategoriesRepositoryInMemory()
    listAllCategoriesUseCase = new ListAllCategoriesUseCase(categoriesRepositoryInMemory);
  });

  it("should list all categories", async () => {
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

    const categories = await listAllCategoriesUseCase.execute();

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
      },
    ];

    expect(categories.isRight()).toBeTruthy();
    expect(categories.value).toEqual(expectedResponse);
  });
});