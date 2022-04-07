import { container } from "tsyringe";

import { CreateCategoryController } from "../../../src/controllers/categories/CreateCategoryController";
import { ICategoriesRepository } from "../../../src/useCases/categories/ports/ICategoriesRepository";
import { CategoriesRepositoryInMemory } from "../../doubles/repositories/CategoriesRepositoryInMemory";

describe("Create Category Controller", () => {
  let createCategoryController: CreateCategoryController;

  beforeEach(() => {
    container.registerSingleton<ICategoriesRepository>("CategoriesRepository", CategoriesRepositoryInMemory);
    createCategoryController = new CreateCategoryController();
  });

  afterAll(() => {
    container.clearInstances();
  });

  it("should return status code 201 and body with the created category", async () => {
    const fakeRequest = {
      requestContext: {
        authorizer: {
          user: {
            id: "admin-id",
            name: "Admin",
            email: "admin@example.com",
          }
        }
      },
      body: {
        name: "Category Name"
      },
    };

    const result = await createCategoryController.handle(fakeRequest);

    expect(result.body).toHaveProperty("id");
    expect(result.body).toHaveProperty("name");
    expect(result.statusCode).toBe(201);
  });

  it("should return status code 400 if name is missing", async () => {
    const fakeRequest = {
      requestContext: {
        authorizer: {
          user: {
            id: "admin-id",
            name: "Admin",
            email: "admin@example.com",
          }
        }
      },
      body: {
      },
    };

    const result = await createCategoryController.handle(fakeRequest);

    expect(result.body).toEqual("Missing parameter(s): name.")
    expect(result.statusCode).toBe(400);
  });

  it("should return status code 401 if user id is missing", async () => {
    const fakeRequest = {
      requestContext: {
        authorizer: {
        }
      },
      body: {
        name: "Category Name"
      },
    };

    const result = await createCategoryController.handle(fakeRequest);

    expect(result.body).toEqual("User is not authenticated!");
    expect(result.statusCode).toBe(401);
  });

  it("should return status code 403 if trying to create an existent category", async () => {
    const fakeRequest = {
      requestContext: {
        authorizer: {
          user: {
            id: "admin-id",
            name: "Admin",
            email: "admin@example.com",
          }
        }
      },
      body: {
        name: "Category Name"
      },
    };

    await createCategoryController.handle(fakeRequest);
    const result = await createCategoryController.handle(fakeRequest);

    expect(result.body).toEqual(`Category "Category Name" already exists`);
    expect(result.statusCode).toBe(403);
  });

  it("should return status code 400 if trying to create an category with invalid name", async () => {
    const invalidName = "a";

    const fakeRequest = {
      requestContext: {
        authorizer: {
          user: {
            id: "admin-id",
            name: "Admin",
            email: "admin@example.com",
          }
        }
      },
      body: {
        name: invalidName
      },
    };

    const result = await createCategoryController.handle(fakeRequest);

    expect(result.body).toEqual(`"${invalidName}" is an invalid category name`);
    expect(result.statusCode).toBe(400);
  });
});