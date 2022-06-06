import { ProductInsufficientStockError } from "../../../src/useCases/products/errors/ProductInsufficientStockError";
import { ProductNotFoundError } from "../../../src/useCases/products/errors/ProductNotFoundError";
import { ReduceProductsStockUseCase } from "../../../src/useCases/products/ReduceProductsStockUseCase";
import { CategoriesRepositoryInMemory } from "../../doubles/repositories/CategoriesRepositoryInMemory";
import { ProductsRepositoryInMemory } from "../../doubles/repositories/ProductsRepositoryInMemory";

describe("Reduce Products Stock UseCase", () => {
  let categoriesRepositoryInMemory: CategoriesRepositoryInMemory;
  let productsRepositoryInMemory: ProductsRepositoryInMemory;
  let reduceProductsStockUseCase: ReduceProductsStockUseCase;

  beforeEach(() => {
    categoriesRepositoryInMemory = new CategoriesRepositoryInMemory()
    productsRepositoryInMemory = new ProductsRepositoryInMemory()
    reduceProductsStockUseCase = new ReduceProductsStockUseCase(productsRepositoryInMemory);
  });

  it("should reduce products stock", async () => {
    const dateNow = new Date();

    const category = await categoriesRepositoryInMemory.create({
      id: "category-id",
      name: "Category Name",
      createdAt: dateNow,
      updatedAt: dateNow,
    })

    await productsRepositoryInMemory.create({
      id: "fake-id-1",
      name: "Product 1",
      price: 120.13,
      stock: 10,
      categoryId: category.id,
      createdAt: dateNow,
      updatedAt: dateNow,
    });

    await productsRepositoryInMemory.create({
      id: "fake-id-2",
      name: "Product 2",
      price: 120.13,
      stock: 10,
      categoryId: category.id,
      createdAt: dateNow,
      updatedAt: dateNow,
    });

    const response = await reduceProductsStockUseCase.execute({
      productsInfos: [
        {
          id: "fake-id-1",
          amount: 3
        },
        {
          id: "fake-id-2",
          amount: 6
        },
      ]
    });

    const expectedResponse = [
      {
        id: "fake-id-1",
        name: "Product 1",
        price: 120.13,
        stock: 7,
        categoryId: category.id,
        createdAt: dateNow,
        updatedAt: dateNow,
      },
      {
        id: "fake-id-2",
        name: "Product 2",
        price: 120.13,
        stock: 4,
        categoryId: category.id,
        createdAt: dateNow,
        updatedAt: dateNow,
      }
    ];

    const products = await productsRepositoryInMemory.listAll();

    expect(response.isRight()).toBeTruthy();
    expect(response.value).toEqual(null);
    expect(products).toEqual(expectedResponse);
  });

  it("should not reduce products stock if at least one product doesn't exist", async () => {
    const dateNow = new Date();

    const category = await categoriesRepositoryInMemory.create({
      id: "category-id",
      name: "Category Name",
      createdAt: dateNow,
      updatedAt: dateNow,
    })

    await productsRepositoryInMemory.create({
      id: "fake-id-1",
      name: "Product 1",
      price: 120.13,
      stock: 10,
      categoryId: category.id,
      createdAt: dateNow,
      updatedAt: dateNow,
    });

    await productsRepositoryInMemory.create({
      id: "fake-id-2",
      name: "Product 2",
      price: 120.13,
      stock: 10,
      categoryId: category.id,
      createdAt: dateNow,
      updatedAt: dateNow,
    });

    const response = await reduceProductsStockUseCase.execute({
      productsInfos: [
        {
          id: "fake-id-1",
          amount: 3
        },
        {
          id: "inexistent-id",
          amount: 6
        },
      ]
    });

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

    const products = await productsRepositoryInMemory.listAll();

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new ProductNotFoundError());
    expect(products).toEqual(expectedResponse);
  });

  it("should not reduce products stock if the product is out of stock", async () => {
    const dateNow = new Date();

    const category = await categoriesRepositoryInMemory.create({
      id: "category-id",
      name: "Category Name",
      createdAt: dateNow,
      updatedAt: dateNow,
    })

    await productsRepositoryInMemory.create({
      id: "fake-id-1",
      name: "Product 1",
      price: 120.13,
      stock: 10,
      categoryId: category.id,
      createdAt: dateNow,
      updatedAt: dateNow,
    });

    await productsRepositoryInMemory.create({
      id: "fake-id-2",
      name: "Product 2",
      price: 120.13,
      stock: 10,
      categoryId: category.id,
      createdAt: dateNow,
      updatedAt: dateNow,
    });

    const response = await reduceProductsStockUseCase.execute({
      productsInfos: [
        {
          id: "fake-id-1",
          amount: 999999
        },
        {
          id: "fake-id-2",
          amount: 999999
        },
      ]
    });

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

    const products = await productsRepositoryInMemory.listAll();

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new ProductInsufficientStockError("fake-id-1"));
    expect(products).toEqual(expectedResponse);
  });
});