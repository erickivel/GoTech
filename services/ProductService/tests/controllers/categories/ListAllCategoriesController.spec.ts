import { container } from "tsyringe";

import { ListAllCategoriesController } from "../../../src/controllers/categories/ListAllCategoriesController";
import { ICategoriesRepository } from "../../../src/useCases/categories/ports/ICategoriesRepository";
import { CategoriesActions } from "../../doubles/CategoriesActions";
import { CategoriesRepositoryInMemory } from "../../doubles/repositories/CategoriesRepositoryInMemory";

describe("List All Categories Controller", () => {
  let listAllCategoriesController: ListAllCategoriesController;

  beforeEach(() => {
    container.registerSingleton<ICategoriesRepository>("CategoriesRepository", CategoriesRepositoryInMemory);
    listAllCategoriesController = new ListAllCategoriesController();
  });

  afterAll(() => {
    container.clearInstances();
  });


  it("should return status code 200 and all categories if user is authenticated", async () => {
    const categoriesActions = container.resolve(CategoriesActions);

    const dateNow = new Date();

    await categoriesActions.create({
      id: "fake-id-1",
      name: "Category 1",
      createdAt: dateNow,
      updatedAt: dateNow,
    });

    await categoriesActions.create({
      id: "fake-id-2",
      name: "Category 2",
      createdAt: dateNow,
      updatedAt: dateNow,
    });

    const result = await listAllCategoriesController.handle({});

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

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(expectedResponse);
  });
});