import { container } from "tsyringe";

import { UpdateCategoryController } from "../../../src/controllers/categories/UpdateCategoryController";
import { ICategoriesRepository } from "../../../src/useCases/categories/ports/ICategoriesRepository";
import { CategoriesActions } from "../../doubles/CategoriesActions";
import { CategoriesRepositoryInMemory } from "../../doubles/repositories/CategoriesRepositoryInMemory";

describe("Update Category Controller", () => {
  let updateCategoryController: UpdateCategoryController;

  beforeEach(() => {
    container.registerSingleton<ICategoriesRepository>("CategoriesRepository", CategoriesRepositoryInMemory);
    updateCategoryController = new UpdateCategoryController();
  });

  afterAll(() => {
    container.clearInstances();
  });

  it("should return status code 201 and body with the updated category", async () => {
    const categoriesActions = container.resolve(CategoriesActions);

    const date = new Date("8-25-2020")

    await categoriesActions.create({
      id: "fake-id",
      name: "Category Name",
      createdAt: date,
      updatedAt: date,
    });

    const fakeRequest = {
      user: {
        id: "admin-id"
      },
      body: {
        name: "New Category Name"
      },
      params: {
        id: "fake-id"
      }
    };

    const result = await updateCategoryController.handle(fakeRequest);

    const expectedResponse = {
      id: "fake-id",
      name: "New Category Name",
      createdAt: date,
    };

    expect(result.body).toMatchObject(expectedResponse);
    expect(result.body.updatedAt).not.toEqual(date);
    expect(result.statusCode).toBe(201);
  });

  it("should return status code 401 if user is not authenticated", async () => {
    const categoriesActions = container.resolve(CategoriesActions);

    const dateNow = new Date();

    await categoriesActions.create({
      id: "fake-id",
      name: "Category Name",
      createdAt: dateNow,
      updatedAt: dateNow,
    });

    const fakeRequest = {
      user: {
      },
      body: {
        name: "New Category Name"
      },
      params: {
        id: "fake-id"
      }
    };

    const result = await updateCategoryController.handle(fakeRequest);

    expect(result.body).toEqual("User is not authenticated!");
    expect(result.statusCode).toBe(401);
  });

  it("should return status code 400 if the name is missing", async () => {
    const categoriesActions = container.resolve(CategoriesActions);

    const dateNow = new Date();

    await categoriesActions.create({
      id: "fake-id",
      name: "Category Name",
      createdAt: dateNow,
      updatedAt: dateNow,
    });

    const fakeRequest = {
      user: {
        id: "admin-id"
      },
      body: {
      },
      params: {
        id: "fake-id"
      }
    };

    const result = await updateCategoryController.handle(fakeRequest);

    expect(result.body).toEqual(`Missing parameter(s): name.`);
    expect(result.statusCode).toBe(400);
  });

  it("should return status code 400 if the category_id is missing", async () => {
    const categoriesActions = container.resolve(CategoriesActions);

    const dateNow = new Date();

    await categoriesActions.create({
      id: "fake-id",
      name: "Category Name",
      createdAt: dateNow,
      updatedAt: dateNow,
    });

    const fakeRequest = {
      user: {
        id: "admin-id"
      },
      body: {
        name: "New Category Name"
      },
      params: {
      }
    };

    const result = await updateCategoryController.handle(fakeRequest);

    expect(result.body).toEqual(`Missing parameter(s): category_id.`);
    expect(result.statusCode).toBe(400);
  });

  it("should return status code 403 if the category already exists", async () => {
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

    const fakeRequest = {
      user: {
        id: "admin-id"
      },
      body: {
        name: "Category 2"
      },
      params: {
        id: "fake-id-1"
      }
    };

    const result = await updateCategoryController.handle(fakeRequest);

    expect(result.body).toEqual(`Category "Category 2" already exists`);
    expect(result.statusCode).toBe(403);
  });

  it("should return status code 400 if trying to updated a category with invalid name", async () => {
    const categoriesActions = container.resolve(CategoriesActions);

    const dateNow = new Date();

    await categoriesActions.create({
      id: "fake-id-1",
      name: "Category 1",
      createdAt: dateNow,
      updatedAt: dateNow,
    });

    const invalidName = "a";

    const fakeRequest = {
      user: {
        id: "admin-id"
      },
      body: {
        name: invalidName
      },
      params: {
        id: "fake-id-1"
      }
    };

    const result = await updateCategoryController.handle(fakeRequest);

    expect(result.body).toEqual(`"${invalidName}" is an invalid category name`);
    expect(result.statusCode).toBe(400);
  });
});