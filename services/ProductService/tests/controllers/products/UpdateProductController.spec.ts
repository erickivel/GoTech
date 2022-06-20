import { container } from "tsyringe";

import { UpdateProductController } from "../../../src/controllers/products/UpdateProductController";
import { ICategoriesRepository } from "../../../src/useCases/categories/ports/ICategoriesRepository";
import { IProductsRepository } from "../../../src/useCases/products/ports/IProductsRepository";
import { CategoriesActions } from "../../doubles/CategoriesActions";
import { ProductsActions } from "../../doubles/ProductsActions";
import { CategoriesRepositoryInMemory } from "../../doubles/repositories/CategoriesRepositoryInMemory";
import { ProductsRepositoryInMemory } from "../../doubles/repositories/ProductsRepositoryInMemory";

describe("Update Product Controller", () => {
  let updateProductController: UpdateProductController;

  beforeEach(() => {
    container.registerSingleton<ICategoriesRepository>(
      "CategoriesRepository",
      CategoriesRepositoryInMemory
    );
    container.registerSingleton<IProductsRepository>(
      "ProductsRepository",
      ProductsRepositoryInMemory
    );
    updateProductController = new UpdateProductController();
  });

  afterAll(() => {
    container.clearInstances();
  });

  it("should return status code 201 and body with the updated product", async () => {
    const categoriesActions = container.resolve(CategoriesActions);

    const date = new Date("8-25-2020");

    const category = await categoriesActions.create({
      id: "category-id",
      name: "Category Name",
      createdAt: date,
      updatedAt: date,
    });

    const productsActions = container.resolve(ProductsActions);

    await productsActions.create({
      id: "product-id",
      name: "Product",
      price: 120.13,
      stock: 1254,
      categoryId: null,
      createdAt: date,
      updatedAt: date,
    });

    const fakeRequest = {
      requestContext: {
        authorizer: {
          lambda: {
            user: {
              id: "admin-id",
              name: "Admin",
              email: "admin@example.com",
            },
          },
        },
      },
      body: {
        name: "New Product Name",
        stock: 100,
        price: 50.42,
        categoryId: category.id,
      },
      pathParameters: {
        id: "product-id",
      },
    };

    const result = await updateProductController.handle(fakeRequest);

    const expectedResponse = {
      id: "product-id",
      name: "New Product Name",
      stock: 100,
      price: 50.42,
      categoryId: category.id,
    };

    expect(result.body).toMatchObject(expectedResponse);
    expect(result.body.updatedAt).not.toEqual(date);
    expect(result.statusCode).toBe(201);
  });

  it("should return status code 401 if user is not authenticated", async () => {
    const categoriesActions = container.resolve(CategoriesActions);

    const date = new Date("8-25-2020");

    const category = await categoriesActions.create({
      id: "category-id",
      name: "Category Name",
      createdAt: date,
      updatedAt: date,
    });

    const productsActions = container.resolve(ProductsActions);

    await productsActions.create({
      id: "product-id",
      name: "Product",
      price: 120.13,
      stock: 1254,
      categoryId: null,
      createdAt: date,
      updatedAt: date,
    });

    const fakeRequest = {
      requestContext: {
        authorizer: {
          lambda: {
            user: {},
          },
        },
      },
      body: {
        name: "New Product Name",
        stock: 100,
        price: 50.42,
        categoryId: category.id,
      },
      pathParameters: {
        id: "product-id",
      },
    };

    const result = await updateProductController.handle(fakeRequest);

    expect(result.body).toEqual("User is not authenticated!");
    expect(result.statusCode).toBe(401);
  });

  it("should return status code 400 if any parameter is missing", async () => {
    const categoriesActions = container.resolve(CategoriesActions);

    const date = new Date("8-25-2020");

    await categoriesActions.create({
      id: "category-id",
      name: "Category Name",
      createdAt: date,
      updatedAt: date,
    });

    const productsActions = container.resolve(ProductsActions);

    await productsActions.create({
      id: "product-id",
      name: "Product Name",
      price: 120.13,
      stock: 1254,
      categoryId: null,
      createdAt: date,
      updatedAt: date,
    });

    const fakeRequest = {
      requestContext: {
        authorizer: {
          lambda: {
            user: {
              id: "admin-id",
              name: "Admin",
              email: "admin@example.com",
            },
          },
        },
      },
      body: {
        stock: 100,
      },
      pathParameters: {
        id: "product-id",
      },
    };

    const result = await updateProductController.handle(fakeRequest);

    expect(result.body).toEqual(`Missing parameter(s): name, price.`);
    expect(result.statusCode).toBe(400);
  });

  it("should return status code 400 if the product_id is missing", async () => {
    const categoriesActions = container.resolve(CategoriesActions);

    const date = new Date("8-25-2020");

    const category = await categoriesActions.create({
      id: "category-id",
      name: "Category Name",
      createdAt: date,
      updatedAt: date,
    });

    const productsActions = container.resolve(ProductsActions);

    await productsActions.create({
      id: "product-id",
      name: "Product",
      price: 120.13,
      stock: 1254,
      categoryId: null,
      createdAt: date,
      updatedAt: date,
    });

    const fakeRequest = {
      requestContext: {
        authorizer: {
          lambda: {
            user: {
              id: "admin-id",
              name: "Admin",
              email: "admin@example.com",
            },
          },
        },
      },
      body: {
        name: "New Product Name",
        stock: 100,
        price: 50.42,
        categoryId: category.id,
      },
      pathParameters: {},
    };

    const result = await updateProductController.handle(fakeRequest);

    expect(result.body).toEqual(`Missing parameter(s): product id.`);
    expect(result.statusCode).toBe(400);
  });

  it("should return status code 403 if the product already exists", async () => {
    const categoriesActions = container.resolve(CategoriesActions);

    const date = new Date("8-25-2020");

    const category = await categoriesActions.create({
      id: "category-id",
      name: "Category Name",
      createdAt: date,
      updatedAt: date,
    });

    const productsActions = container.resolve(ProductsActions);

    await productsActions.create({
      id: "product-id-1",
      name: "Product 1",
      price: 120.13,
      stock: 1254,
      categoryId: category.id,
      createdAt: date,
      updatedAt: date,
    });

    await productsActions.create({
      id: "product-id-2",
      name: "Product 2",
      price: 120.13,
      stock: 1254,
      categoryId: category.id,
      createdAt: date,
      updatedAt: date,
    });

    const fakeRequest = {
      requestContext: {
        authorizer: {
          lambda: {
            user: {
              id: "admin-id",
              name: "Admin",
              email: "admin@example.com",
            },
          },
        },
      },
      body: {
        name: "Product 2",
        stock: 100,
        price: 50.42,
        categoryId: category.id,
      },
      pathParameters: {
        id: "product-id-1",
      },
    };

    const result = await updateProductController.handle(fakeRequest);

    expect(result.body).toEqual(`Product "Product 2" already exists`);
    expect(result.statusCode).toBe(403);
  });

  it("should return status code 400 if trying to updated a category with invalid name", async () => {
    const categoriesActions = container.resolve(CategoriesActions);

    const date = new Date("8-25-2020");

    const category = await categoriesActions.create({
      id: "category-id",
      name: "Category Name",
      createdAt: date,
      updatedAt: date,
    });

    const productsActions = container.resolve(ProductsActions);

    await productsActions.create({
      id: "product-id",
      name: "Product",
      price: 120.13,
      stock: 1254,
      categoryId: null,
      createdAt: date,
      updatedAt: date,
    });

    const invalidName = "a";

    const fakeRequest = {
      requestContext: {
        authorizer: {
          lambda: {
            user: {
              id: "admin-id",
              name: "Admin",
              email: "admin@example.com",
            },
          },
        },
      },
      body: {
        name: invalidName,
        stock: 100,
        price: 50.42,
        categoryId: category.id,
      },
      pathParameters: {
        id: "product-id",
      },
    };

    const result = await updateProductController.handle(fakeRequest);

    expect(result.body).toEqual(`"${invalidName}" is an invalid product name`);
    expect(result.statusCode).toBe(400);
  });
});
