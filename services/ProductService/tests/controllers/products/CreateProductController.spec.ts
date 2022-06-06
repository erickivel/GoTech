import { container } from "tsyringe";

import { CreateProductController } from "../../../src/controllers/products/CreateProductController";
import { ICategoriesRepository } from "../../../src/useCases/categories/ports/ICategoriesRepository";
import { IProductsRepository } from "../../../src/useCases/products/ports/IProductsRepository";
import { CategoriesActions } from "../../doubles/CategoriesActions";
import { CategoriesRepositoryInMemory } from "../../doubles/repositories/CategoriesRepositoryInMemory";
import { ProductsRepositoryInMemory } from "../../doubles/repositories/ProductsRepositoryInMemory";

describe("Create Product Controller", () => {
  let createProductController: CreateProductController;

  beforeEach(() => {
    container.registerSingleton<ICategoriesRepository>("CategoriesRepository", CategoriesRepositoryInMemory);
    container.registerSingleton<IProductsRepository>("ProductsRepository", ProductsRepositoryInMemory);
    createProductController = new CreateProductController();
  });

  afterAll(() => {
    container.clearInstances();
  });

  it("should return status code 201 and body with the created product", async () => {
    const categoriesActions = container.resolve(CategoriesActions);

    const category = await categoriesActions.create({
      id: "category-id",
      name: "Category Name",
      createdAt: new Date(),
      updatedAt: new Date(),
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
      body: {
        name: "Product Name",
        stock: 100,
        price: 25.42,
        categoryId: category.id,
      },
    };

    const result = await createProductController.handle(fakeRequest);

    expect(result.body).toHaveProperty("id");
    expect(result.body).toHaveProperty("name");
    expect(result.body).toHaveProperty("stock");
    expect(result.body).toHaveProperty("price");
    expect(result.body).toHaveProperty("categoryId");
    expect(result.statusCode).toBe(201);
  });

  it("should return status code 401 if user id is missing", async () => {
    const categoriesActions = container.resolve(CategoriesActions);

    const category = await categoriesActions.create({
      id: "category-id",
      name: "Category Name",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const fakeRequest = {
      requestContext: {
        authorizer: {
        }
      },
      body: {
        name: "Product Name",
        stock: 100,
        price: 25.42,
        categoryId: category.id,
      },
    };

    const result = await createProductController.handle(fakeRequest);

    expect(result.body).toEqual("User is not authenticated!");
    expect(result.statusCode).toBe(401);
  });

  it("should return status code 400 if params are missing", async () => {
    const categoriesActions = container.resolve(CategoriesActions);

    const category = await categoriesActions.create({
      id: "category-id",
      name: "Category Name",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const fakeRequest = {
      requestContext: {
        authorizer: {
          user: {
            id: "admin-id",
            name: "Admin",
            email: "admin@example.com",
          },
        },
      },
      body: {
      },
    };

    const result = await createProductController.handle(fakeRequest);

    expect(result.body).toEqual("Missing parameter(s): name, stock, price, categoryId.");
    expect(result.statusCode).toBe(400);
  });

  it("should return status code 403 if trying to create a product that already exists", async () => {
    const categoriesActions = container.resolve(CategoriesActions);

    const category = await categoriesActions.create({
      id: "category-id",
      name: "Category Name",
      createdAt: new Date(),
      updatedAt: new Date(),
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
      body: {
        name: "Product Name",
        stock: 100,
        price: 25.42,
        categoryId: category.id,
      },
    };

    await createProductController.handle(fakeRequest);
    const result = await createProductController.handle(fakeRequest);

    expect(result.body).toEqual(`Product "Product Name" already exists`);
    expect(result.statusCode).toBe(403);
  });

  it("should return status code 403 if trying to create a product with an inexistent category", async () => {
    const categoriesActions = container.resolve(CategoriesActions);

    await categoriesActions.create({
      id: "category-id",
      name: "Category Name",
      createdAt: new Date(),
      updatedAt: new Date(),
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
      body: {
        name: "Product Name",
        stock: 100,
        price: 25.42,
        categoryId: "inexistent-category-id",
      },
    };

    const result = await createProductController.handle(fakeRequest);

    expect(result.body).toEqual(`Category with id: "inexistent-category-id" not found.`);
    expect(result.statusCode).toBe(403);
  });

  it("should return status code 403 if trying to create a product with an invalid name or price or stock", async () => {
    const categoriesActions = container.resolve(CategoriesActions);

    const category = await categoriesActions.create({
      id: "category-id",
      name: "Category Name",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const fakeRequestInvalidName = {
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
        name: "a",
        stock: 100,
        price: 25.42,
        categoryId: category.id,
      },
    };

    const resultInvalidName = await createProductController.handle(fakeRequestInvalidName);

    const fakeRequestInvalidStock = {
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
        name: "Product Name",
        stock: 10.4,
        price: 25.42,
        categoryId: category.id,
      },
    };

    const resultInvalidStock = await createProductController.handle(fakeRequestInvalidStock);

    const fakeRequestInvalidPrice = {
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
        name: "Product Name",
        stock: 10,
        price: 25.424,
        categoryId: category.id,
      },
    };

    const resultInvalidPrice = await createProductController.handle(fakeRequestInvalidPrice);

    expect(resultInvalidName.body).toEqual(`"a" is an invalid product name`);
    expect(resultInvalidName.statusCode).toBe(400);
    expect(resultInvalidStock.body).toEqual(`"10.4" is an invalid product stock`);
    expect(resultInvalidStock.statusCode).toBe(400);
    expect(resultInvalidPrice.body).toEqual(`"25.424" is an invalid product price`);
    expect(resultInvalidPrice.statusCode).toBe(400);
  });
});