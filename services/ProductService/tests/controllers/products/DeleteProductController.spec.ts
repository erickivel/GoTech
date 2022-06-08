import { container } from "tsyringe";

import { DeleteProductController } from "../../../src/controllers/products/DeleteProductController";
import { ICategoriesRepository } from "../../../src/useCases/categories/ports/ICategoriesRepository";
import { IProductsRepository } from "../../../src/useCases/products/ports/IProductsRepository";
import { CategoriesActions } from "../../doubles/CategoriesActions";
import { ProductsActions } from "../../doubles/ProductsActions";
import { CategoriesRepositoryInMemory } from "../../doubles/repositories/CategoriesRepositoryInMemory";
import { ProductsRepositoryInMemory } from "../../doubles/repositories/ProductsRepositoryInMemory";

describe("Delete Product Controller", () => {
  let deleteProductController: DeleteProductController;

  beforeEach(() => {
    container.registerSingleton<ICategoriesRepository>("CategoriesRepository", CategoriesRepositoryInMemory);
    container.registerSingleton<IProductsRepository>("ProductsRepository", ProductsRepositoryInMemory);
    deleteProductController = new DeleteProductController();
  });

  afterAll(() => {
    container.clearInstances();
  });

  it("should return status code 200 and successfully message when the product is deleted", async () => {
    const categoriesActions = container.resolve(CategoriesActions);
    const productsActions = container.resolve(ProductsActions);

    const dateNow = new Date()

    const category = await categoriesActions.create({
      id: "category-id",
      name: "Category Name",
      createdAt: dateNow,
      updatedAt: dateNow,
    });

    await productsActions.create({
      id: "product-id-1",
      name: "Product 1",
      price: 120.13,
      stock: 1254,
      categoryId: category.id,
      createdAt: dateNow,
      updatedAt: dateNow,
    });

    await productsActions.create({
      id: "product-id-2",
      name: "Product 2",
      price: 120.13,
      stock: 1254,
      categoryId: category.id,
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
        id: "product-id-2"
      }
    };

    const result = await deleteProductController.handle(fakeRequest);

    const products = await productsActions.listAll();

    expect(products.length).toEqual(1);
    expect(result.body).toEqual("Product deleted successfully!");
    expect(result.statusCode).toBe(200);
  });

  it("should return status code 401 if user is not authenticated", async () => {
    const categoriesActions = container.resolve(CategoriesActions);
    const productsActions = container.resolve(ProductsActions);

    const dateNow = new Date()

    const category = await categoriesActions.create({
      id: "category-id",
      name: "Category Name",
      createdAt: dateNow,
      updatedAt: dateNow,
    });

    await productsActions.create({
      id: "product-id-1",
      name: "Product 1",
      price: 120.13,
      stock: 1254,
      categoryId: category.id,
      createdAt: dateNow,
      updatedAt: dateNow,
    });

    const fakeRequest = {
      requestContext: {
        authorizer: {}
      },
      pathParameters: {
        id: "product-id-1"
      }
    };

    const result = await deleteProductController.handle(fakeRequest);

    expect(result.body).toEqual("User is not authenticated!");
    expect(result.statusCode).toBe(401);
  });

  it("should return status code 400 if category_id is missing", async () => {
    const categoriesActions = container.resolve(CategoriesActions);
    const productsActions = container.resolve(ProductsActions);

    const dateNow = new Date()

    const category = await categoriesActions.create({
      id: "category-id",
      name: "Category Name",
      createdAt: dateNow,
      updatedAt: dateNow,
    });

    await productsActions.create({
      id: "product-id-1",
      name: "Product 1",
      price: 120.13,
      stock: 1254,
      categoryId: category.id,
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

    const result = await deleteProductController.handle(fakeRequest);

    expect(result.body).toEqual("Missing parameter(s): product id.");
    expect(result.statusCode).toBe(400);
  });

  it("should return status code 403 if category doesn't exist", async () => {
    const categoriesActions = container.resolve(CategoriesActions);
    const productsActions = container.resolve(ProductsActions);

    const dateNow = new Date()

    const category = await categoriesActions.create({
      id: "category-id",
      name: "Category Name",
      createdAt: dateNow,
      updatedAt: dateNow,
    });

    await productsActions.create({
      id: "product-id-1",
      name: "Product 1",
      price: 120.13,
      stock: 1254,
      categoryId: category.id,
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

    const result = await deleteProductController.handle(fakeRequest);

    expect(result.body).toEqual(`Product with id "${inexistentId}" not found`);
    expect(result.statusCode).toBe(403);
  });
});