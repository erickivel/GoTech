import { DeleteProductUseCase } from "../../../src/useCases/products/DeleteProductUseCase";
import { ProductNotFoundError } from "../../../src/useCases/products/errors/ProductNotFoundError";
import { CategoriesRepositoryInMemory } from "../../doubles/repositories/CategoriesRepositoryInMemory";
import { ProductsRepositoryInMemory } from "../../doubles/repositories/ProductsRepositoryInMemory";

describe("Delete Product UseCase", () => {
  let categoriesRepositoryInMemory: CategoriesRepositoryInMemory;
  let productsRepositoryInMemory: ProductsRepositoryInMemory;
  let deleteProductUseCase: DeleteProductUseCase;

  beforeEach(() => {
    categoriesRepositoryInMemory = new CategoriesRepositoryInMemory()
    productsRepositoryInMemory = new ProductsRepositoryInMemory()
    deleteProductUseCase = new DeleteProductUseCase(productsRepositoryInMemory);
  });

  it("should delete a product", async () => {
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

    const deleteOrError = await deleteProductUseCase.execute({ product_id: "fake-id-1" });

    const products = await productsRepositoryInMemory.listAll();

    const expectedResponse = [
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

    expect(deleteOrError.isRight()).toBeTruthy();
    expect(deleteOrError.value).toEqual(null);
    expect(products).toEqual(expectedResponse);
  });

  it("should not delete a product if it doesn't exist", async () => {
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

    const inexistentId = "inexistent-id"

    const deleteOrError = await deleteProductUseCase.execute({ product_id: inexistentId });

    const products = await productsRepositoryInMemory.listAll();

    const expectedResponse = [
      {
        id: "fake-id-1",
        name: "Product 1",
        price: 120.13,
        stock: 1254,
        categoryId: category.id,
        createdAt: dateNow,
        updatedAt: dateNow,
      }
    ];

    expect(deleteOrError.isLeft()).toBeTruthy();
    expect(deleteOrError.value).toEqual(new ProductNotFoundError(inexistentId));
    expect(products).toEqual(expectedResponse);
  });
});