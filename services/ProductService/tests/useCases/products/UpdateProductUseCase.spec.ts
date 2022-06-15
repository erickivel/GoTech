import { InvalidCategoryNameError } from "../../../src/domain/entities/Category/errors/InvalidCategoryNameError";
import { InvalidProductNameError } from "../../../src/domain/entities/Product/errors/InvalidProductNameError";
import { CategoryAlreadyExistsError } from "../../../src/useCases/categories/errors/CategoryAlreadyExistsError";
import { CategoryNotFoundError } from "../../../src/useCases/categories/errors/CategoryNotFoundError";
import { ProductAlreadyExistsError } from "../../../src/useCases/products/errors/ProductAlreadyExistsError";
import { ProductNotFoundError } from "../../../src/useCases/products/errors/ProductNotFoundError";
import { UpdateProductUseCase } from "../../../src/useCases/products/UpdateProductUseCase";
import { CategoriesRepositoryInMemory } from "../../doubles/repositories/CategoriesRepositoryInMemory";
import { ProductsRepositoryInMemory } from "../../doubles/repositories/ProductsRepositoryInMemory";

describe("Update Product UseCase", () => {
  let productsRepositoryInMemory: ProductsRepositoryInMemory;
  let categoriesRepositoryInMemory: CategoriesRepositoryInMemory;
  let updateProductUseCase: UpdateProductUseCase;

  beforeEach(() => {
    categoriesRepositoryInMemory = new CategoriesRepositoryInMemory();
    productsRepositoryInMemory = new ProductsRepositoryInMemory();
    updateProductUseCase = new UpdateProductUseCase(
      productsRepositoryInMemory,
      categoriesRepositoryInMemory
    );
  });

  it("should update a product", async () => {
    const dateNow = new Date("8-25-2020");

    const category = await categoriesRepositoryInMemory.create({
      id: "category-id",
      name: "Category Name",
      createdAt: dateNow,
      updatedAt: dateNow,
    });

    await productsRepositoryInMemory.create({
      id: "product_id",
      name: "Product 1",
      price: 120.13,
      stock: 1254,
      categoryId: category.id,
      createdAt: dateNow,
      updatedAt: dateNow,
    });

    const productOrError = await updateProductUseCase.execute({
      product_id: "product_id",
      name: "New Product Name",
      price: 20.13,
      stock: 24,
      categoryId: category.id,
    });

    const expectedResponse = {
      id: "product_id",
      name: "New Product Name",
      price: 20.13,
      stock: 24,
      categoryId: category.id,
      createdAt: dateNow,
    };

    if (productOrError.isLeft()) {
      throw new Error("Update Product UseCase Error");
    }
    expect(productOrError.isRight()).toBeTruthy();
    expect(productOrError.value).toMatchObject(expectedResponse);
  });

  it("should not update a product that doesn't exist", async () => {
    const dateNow = new Date();

    const category = await categoriesRepositoryInMemory.create({
      id: "category-id",
      name: "Category Name",
      createdAt: dateNow,
      updatedAt: dateNow,
    });

    await productsRepositoryInMemory.create({
      id: "product_id",
      name: "Product 1",
      price: 120.13,
      stock: 1254,
      categoryId: category.id,
      createdAt: dateNow,
      updatedAt: dateNow,
    });

    const invalidId = "invalid-id";

    const productOrError = await updateProductUseCase.execute({
      product_id: invalidId,
      name: "New Product Name",
      price: 20.13,
      stock: 24,
      categoryId: category.id,
    });

    expect(productOrError.isLeft()).toBeTruthy();
    expect(productOrError.value).toEqual(new ProductNotFoundError(invalidId));
  });

  it("should not update a product with an already taken name", async () => {
    const dateNow = new Date();

    const category = await categoriesRepositoryInMemory.create({
      id: "category-id",
      name: "Category Name",
      createdAt: dateNow,
      updatedAt: dateNow,
    });

    await productsRepositoryInMemory.create({
      id: "product_id_1",
      name: "Product 1",
      price: 120.13,
      stock: 1254,
      categoryId: category.id,
      createdAt: dateNow,
      updatedAt: dateNow,
    });

    await productsRepositoryInMemory.create({
      id: "product_id_2",
      name: "Product 2",
      price: 120.13,
      stock: 1254,
      categoryId: category.id,
      createdAt: dateNow,
      updatedAt: dateNow,
    });

    const productOrError = await updateProductUseCase.execute({
      product_id: "product_id_1",
      name: "Product 2",
      price: 20.13,
      stock: 24,
      categoryId: category.id,
    });

    expect(productOrError.isLeft()).toBeTruthy();
    expect(productOrError.value).toEqual(
      new ProductAlreadyExistsError("Product 2")
    );
  });

  it("should not update a product with an invalid name", async () => {
    const dateNow = new Date();

    const category = await categoriesRepositoryInMemory.create({
      id: "category-id",
      name: "Category Name",
      createdAt: dateNow,
      updatedAt: dateNow,
    });

    await productsRepositoryInMemory.create({
      id: "product_id_1",
      name: "Product 1",
      price: 120.13,
      stock: 1254,
      categoryId: category.id,
      createdAt: dateNow,
      updatedAt: dateNow,
    });

    const invalidName = "a";

    const productOrError = await updateProductUseCase.execute({
      product_id: "product_id_1",
      name: invalidName,
      price: 120.13,
      stock: 1254,
      categoryId: category.id,
    });

    expect(productOrError.isLeft()).toBeTruthy();
    expect(productOrError.value).toEqual(
      new InvalidProductNameError(invalidName)
    );
  });

  it("should not be able to update a product with an invalid category id", async () => {
    const dateNow = new Date();

    const category = await categoriesRepositoryInMemory.create({
      id: "category-id",
      name: "Category Name",
      createdAt: dateNow,
      updatedAt: dateNow,
    });

    await productsRepositoryInMemory.create({
      id: "product_id_1",
      name: "Product 1",
      price: 120.13,
      stock: 1254,
      categoryId: category.id,
      createdAt: dateNow,
      updatedAt: dateNow,
    });

    const invalidCategoryId = "invalid_category_id";

    const productOrError = await updateProductUseCase.execute({
      product_id: "product_id_1",
      name: "New Name",
      price: 120.13,
      stock: 1254,
      categoryId: invalidCategoryId,
    });

    expect(productOrError.isLeft()).toBeTruthy();
    expect(productOrError.value).toEqual(
      new CategoryNotFoundError(invalidCategoryId)
    );
  });
});
