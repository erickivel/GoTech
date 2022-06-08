import { container } from "tsyringe";

import { DeleteCategoryController } from "../../../src/controllers/categories/DeleteCategoryController";
import { ICategoriesRepository } from "../../../src/useCases/categories/ports/ICategoriesRepository";
import { CategoriesActions } from "../../doubles/CategoriesActions";
import { CategoriesRepositoryInMemory } from "../../doubles/repositories/CategoriesRepositoryInMemory";

describe("Delete Category Controller", () => {
  let deleteCategoryController: DeleteCategoryController;

  beforeEach(() => {
    container.registerSingleton<ICategoriesRepository>("CategoriesRepository", CategoriesRepositoryInMemory);
    deleteCategoryController = new DeleteCategoryController();
  });

  afterAll(() => {
    container.clearInstances();
  });

  it("should return status code 200 and successfully message when the category is deleted", async () => {
    const categoriesActions = container.resolve(CategoriesActions);

    const dateNow = new Date()

    await categoriesActions.create({
      id: "fake-id",
      name: "Category Name",
      createdAt: dateNow,
      updatedAt: dateNow,
    });

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
      pathParameters: {
        id: "fake-id"
      }
    };

    const result = await deleteCategoryController.handle(fakeRequest);

    const categories = await categoriesActions.listAll();

    expect(categories.length).toEqual(0);
    expect(result.body).toEqual("Category deleted successfully!");
    expect(result.statusCode).toBe(200);
  });

  it("should return status code 401 if user is not authenticated", async () => {
    const categoriesActions = container.resolve(CategoriesActions);

    const dateNow = new Date()

    await categoriesActions.create({
      id: "fake-id",
      name: "Category Name",
      createdAt: dateNow,
      updatedAt: dateNow,
    });

    const fakeRequest = {
      requestContext: {
        authorizer: {
        }
      },
      pathParameters: {
        id: "fake-id"
      }
    };

    const result = await deleteCategoryController.handle(fakeRequest);

    expect(result.body).toEqual("User is not authenticated!");
    expect(result.statusCode).toBe(401);
  });

  it("should return status code 400 if category_id is missing", async () => {
    const categoriesActions = container.resolve(CategoriesActions);

    const dateNow = new Date()

    await categoriesActions.create({
      id: "fake-id",
      name: "Category Name",
      createdAt: dateNow,
      updatedAt: dateNow,
    });

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
      pathParameters: {
      }
    };

    const result = await deleteCategoryController.handle(fakeRequest);

    expect(result.body).toEqual("Missing parameter(s): category_id.");
    expect(result.statusCode).toBe(400);
  });

  it("should return status code 403 if category doesn't exist", async () => {
    const categoriesActions = container.resolve(CategoriesActions);

    const dateNow = new Date()

    await categoriesActions.create({
      id: "fake-id",
      name: "Category Name",
      createdAt: dateNow,
      updatedAt: dateNow,
    });

    const inexistentId = "inexistent-id";

    const fakeRequest = {
      requestContext: {
        authorizer: {
          user: {
            id: "admin-id",
            email: "admin@example.com",
            name: "Admin",
          }
        }
      },
      pathParameters: {
        id: inexistentId
      }
    };

    const result = await deleteCategoryController.handle(fakeRequest);

    expect(result.body).toEqual(`Category with id: "${inexistentId}" not found.`);
    expect(result.statusCode).toBe(403);
  });
});