import { container } from "tsyringe";

import { ListAllProductsController } from "../../../src/controllers/products/ListAllProductsController";
import { ICategoriesRepository } from "../../../src/useCases/categories/ports/ICategoriesRepository";
import { IProductsRepository } from "../../../src/useCases/products/ports/IProductsRepository";
import { CategoriesActions } from "../../doubles/CategoriesActions";
import { ProductsActions } from "../../doubles/ProductsActions";
import { CategoriesRepositoryInMemory } from "../../doubles/repositories/CategoriesRepositoryInMemory";
import { ProductsRepositoryInMemory } from "../../doubles/repositories/ProductsRepositoryInMemory";

describe("List All Products Controller", () => {
  let listAllProductsController: ListAllProductsController;

  beforeEach(() => {
    container.registerSingleton<IProductsRepository>("ProductsRepository", ProductsRepositoryInMemory);
    container.registerSingleton<ICategoriesRepository>("CategoriesRepository", CategoriesRepositoryInMemory);
    listAllProductsController = new ListAllProductsController();
  });

  afterAll(() => {
    container.clearInstances();
  });


  it("should return status code 200 and all products", async () => {
    const categoriesActions = container.resolve(CategoriesActions);

    const dateNow = new Date();

    const category = await categoriesActions.create({
      id: "fake-id-1",
      name: "Category 1",
      createdAt: dateNow,
      updatedAt: dateNow,
    });

    const productsActions = container.resolve(ProductsActions);

    await productsActions.create({
      id: "fake-id-1",
      name: "Product 1",
      price: 120.13,
      stock: 1254,
      categoryId: category.id,
      createdAt: dateNow,
      updatedAt: dateNow,
    });

    await productsActions.create({
      id: "fake-id-2",
      name: "Product 2",
      price: 120.13,
      stock: 1254,
      categoryId: category.id,
      createdAt: dateNow,
      updatedAt: dateNow,
    });

    const result = await listAllProductsController.handle({});

    const expectedResponse = [
      {
        id: "fake-id-1",
        name: "Product 1",
        price: 120.13,
        stock: 1254,
        categoryId: category.id,
        createdAt: dateNow,
        updatedAt: dateNow,
      },
      {
        id: "fake-id-2",
        name: "Product 2",
        price: 120.13,
        stock: 1254,
        categoryId: category.id,
        createdAt: dateNow,
        updatedAt: dateNow,
      }
    ];

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(expectedResponse);
  });
});