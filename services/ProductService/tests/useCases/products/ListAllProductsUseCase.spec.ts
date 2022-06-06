import { ListAllProductsUseCase } from "../../../src/useCases/products/ListAllProductsUseCase";
import { CategoriesRepositoryInMemory } from "../../doubles/repositories/CategoriesRepositoryInMemory";
import { ProductsRepositoryInMemory } from "../../doubles/repositories/ProductsRepositoryInMemory";

describe("List All Products UseCase", () => {
  let categoriesRepositoryInMemory: CategoriesRepositoryInMemory;
  let productsRepositoryInMemory: ProductsRepositoryInMemory;
  let listAllProductsUseCase: ListAllProductsUseCase;

  beforeEach(() => {
    categoriesRepositoryInMemory = new CategoriesRepositoryInMemory()
    productsRepositoryInMemory = new ProductsRepositoryInMemory()
    listAllProductsUseCase = new ListAllProductsUseCase(productsRepositoryInMemory);
  });

  it("should list all products", async () => {
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
      stock: 1254,
      categoryId: category.id,
      createdAt: dateNow,
      updatedAt: dateNow,
    });

    await productsRepositoryInMemory.create({
      id: "fake-id-2",
      name: "Product 2",
      price: 120.13,
      stock: 1254,
      categoryId: category.id,
      createdAt: dateNow,
      updatedAt: dateNow,
    });

    const products = await listAllProductsUseCase.execute();

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

    expect(products.isRight()).toBeTruthy();
    expect(products.value).toEqual(expectedResponse);
  });
});