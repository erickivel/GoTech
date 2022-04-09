import { container } from "tsyringe";
import { IServerlessHttpRequest } from "../../../src/controllers/ports/IServerlessHttpRequest";

import { ListAllProductsController } from "../../../src/controllers/products/ListAllProductsController";
import { ReduceProductsStockController } from "../../../src/controllers/products/ReduceProductsStockController";
import { ICategoriesRepository } from "../../../src/useCases/categories/ports/ICategoriesRepository";
import { IProductsRepository } from "../../../src/useCases/products/ports/IProductsRepository";
import { CategoriesActions } from "../../doubles/CategoriesActions";
import { ProductsActions } from "../../doubles/ProductsActions";
import { CategoriesRepositoryInMemory } from "../../doubles/repositories/CategoriesRepositoryInMemory";
import { ProductsRepositoryInMemory } from "../../doubles/repositories/ProductsRepositoryInMemory";

describe("Reduce Products Stock Controller", () => {
  let reduceProductsStockController: ReduceProductsStockController;

  beforeEach(() => {
    container.registerSingleton<IProductsRepository>("ProductsRepository", ProductsRepositoryInMemory);
    container.registerSingleton<ICategoriesRepository>("CategoriesRepository", CategoriesRepositoryInMemory);
    reduceProductsStockController = new ReduceProductsStockController();
  });

  afterAll(() => {
    container.clearInstances();
  });

  it("should return status code 200 when product stock is reduced", async () => {
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
      stock: 10,
      categoryId: category.id,
      createdAt: dateNow,
      updatedAt: dateNow,
    });

    await productsActions.create({
      id: "fake-id-2",
      name: "Product 2",
      price: 120.13,
      stock: 10,
      categoryId: category.id,
      createdAt: dateNow,
      updatedAt: dateNow,
    });

    const message = JSON.stringify({
      products: [
        {
          id: "fake-id-1",
          amount: 2,
        },
        {
          id: "fake-id-2",
          amount: 5,
        },
      ],
    });

    const fakeRequest = {
      requestContext: {},
      Records: [
        {
          Sns: {
            Message: message,
          }
        },
      ]
    } as IServerlessHttpRequest;

    const result = await reduceProductsStockController.handle(fakeRequest);

    const products = await productsActions.listAll();

    const expectedResponse = [
      {
        id: "fake-id-1",
        name: "Product 1",
        price: 120.13,
        stock: 8,
        categoryId: category.id,
        createdAt: dateNow,
        updatedAt: dateNow,
      },
      {
        id: "fake-id-2",
        name: "Product 2",
        price: 120.13,
        stock: 5,
        categoryId: category.id,
        createdAt: dateNow,
        updatedAt: dateNow,
      }
    ];

    expect(result.body).toEqual("Products Stock Updated!");
    expect(products).toEqual(expectedResponse);
    expect(result.statusCode).toBe(200);
  });

  it("should return status code 400 if message is missing", async () => {
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
      stock: 10,
      categoryId: category.id,
      createdAt: dateNow,
      updatedAt: dateNow,
    });

    await productsActions.create({
      id: "fake-id-2",
      name: "Product 2",
      price: 120.13,
      stock: 10,
      categoryId: category.id,
      createdAt: dateNow,
      updatedAt: dateNow,
    });

    const fakeRequest = {
      requestContext: {},
    } as IServerlessHttpRequest;

    const result = await reduceProductsStockController.handle(fakeRequest);

    const products = await productsActions.listAll();

    const expectedResponse = [
      {
        id: "fake-id-1",
        name: "Product 1",
        price: 120.13,
        stock: 10,
        categoryId: category.id,
        createdAt: dateNow,
        updatedAt: dateNow,
      },
      {
        id: "fake-id-2",
        name: "Product 2",
        price: 120.13,
        stock: 10,
        categoryId: category.id,
        createdAt: dateNow,
        updatedAt: dateNow,
      }
    ];

    expect(result.body).toEqual("Message not received!");
    expect(products).toEqual(expectedResponse);
    expect(result.statusCode).toBe(400);
  });

  it("should return status code 403 if amount is greater than stock", async () => {
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
      stock: 10,
      categoryId: category.id,
      createdAt: dateNow,
      updatedAt: dateNow,
    });

    await productsActions.create({
      id: "fake-id-2",
      name: "Product 2",
      price: 120.13,
      stock: 10,
      categoryId: category.id,
      createdAt: dateNow,
      updatedAt: dateNow,
    });

    const message = JSON.stringify({
      products: [
        {
          id: "fake-id-1",
          amount: 25,
        },
        {
          id: "fake-id-2",
          amount: 5,
        },
      ],
    });

    const fakeRequest = {
      requestContext: {},
      Records: [
        {
          Sns: {
            Message: message,
          }
        },
      ]
    } as IServerlessHttpRequest;

    const result = await reduceProductsStockController.handle(fakeRequest);

    const products = await productsActions.listAll();

    const expectedResponse = [
      {
        id: "fake-id-1",
        name: "Product 1",
        price: 120.13,
        stock: 10,
        categoryId: category.id,
        createdAt: dateNow,
        updatedAt: dateNow,
      },
      {
        id: "fake-id-2",
        name: "Product 2",
        price: 120.13,
        stock: 10,
        categoryId: category.id,
        createdAt: dateNow,
        updatedAt: dateNow,
      }
    ];

    expect(result.body).toEqual(`Product with id "fake-id-1" has insufficient stock`);
    expect(products).toEqual(expectedResponse);
    expect(result.statusCode).toBe(403);
  });
});