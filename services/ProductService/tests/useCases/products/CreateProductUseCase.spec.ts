import { InvalidProductNameError } from "../../../src/domain/entities/Product/errors/InvalidProductNameError";
import { InvalidProductPriceError } from "../../../src/domain/entities/Product/errors/InvalidProductPriceError";
import { InvalidProductStockError } from "../../../src/domain/entities/Product/errors/InvalidProductStockError";
import { CategoryNotFoundError } from "../../../src/useCases/categories/errors/CategoryNotFoundError";
import { CreateProductUseCase } from "../../../src/useCases/products/CreateProductUseCase";
import { ProductAlreadyExistsError } from "../../../src/useCases/products/errors/ProductAlreadyExistsError";
import { CategoriesRepositoryInMemory } from "../../doubles/repositories/CategoriesRepositoryInMemory";
import { ProductsRepositoryInMemory } from "../../doubles/repositories/ProductsRepositoryInMemory";

describe("Create Product UseCase", () => {
  let productsRepositoryInMemory: ProductsRepositoryInMemory;
  let categoriesRepositoryInMemory: CategoriesRepositoryInMemory;
  let createProductUseCase: CreateProductUseCase;

  beforeEach(() => {
    productsRepositoryInMemory = new ProductsRepositoryInMemory();
    categoriesRepositoryInMemory = new CategoriesRepositoryInMemory()
    createProductUseCase = new CreateProductUseCase(productsRepositoryInMemory, categoriesRepositoryInMemory);
  });

  it("should create a product", async () => {
    const category = await categoriesRepositoryInMemory.create({
      id: "fake-category-id",
      name: "Category Name",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const product = {
      name: "New Product",
      price: 142.67,
      stock: 10,
      categoryId: category.id,
    };

    const productOrError = await createProductUseCase.execute(product);

    expect(productOrError.isRight).toBeTruthy();
    expect(productOrError.value).toHaveProperty("id");
    expect(productOrError.value).toHaveProperty("name");
    expect(productOrError.value).toHaveProperty("price");
    expect(productOrError.value).toHaveProperty("stock");
    expect(productOrError.value).toHaveProperty("categoryId");
    expect(productOrError.value).toHaveProperty("createdAt");
    expect(productOrError.value).toHaveProperty("updatedAt");
  });

  it("should not create a product if it already exists", async () => {
    const category = await categoriesRepositoryInMemory.create({
      id: "fake-category-id",
      name: "Category Name",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const product = {
      name: "New Product",
      price: 142.67,
      stock: 10,
      categoryId: category.id,
    };


    await createProductUseCase.execute(product);
    const productOrError = await createProductUseCase.execute(product);

    expect(productOrError.isLeft).toBeTruthy();
    expect(productOrError.value).toEqual(new ProductAlreadyExistsError("New Product"));
  });

  it("should not create a product if its category doesn't exist", async () => {
    const product = {
      name: "New Product",
      price: 142.67,
      stock: 10,
      categoryId: "inexistent-category-id",
    };

    const productOrError = await createProductUseCase.execute(product);

    expect(productOrError.isLeft).toBeTruthy();
    expect(productOrError.value).toEqual(new CategoryNotFoundError("inexistent-category-id"));
  });

  it("should not create a product if its name or price or stock are invalid", async () => {
    const category = await categoriesRepositoryInMemory.create({
      id: "fake-category-id",
      name: "Category Name",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const invalidName = "a";

    const invalidNameProduct = {
      name: invalidName,
      price: 142.67,
      stock: 10,
      categoryId: category.id,
    };

    const invalidNameProductOrError = await createProductUseCase.execute(invalidNameProduct);

    const invalidStock = 10.9;

    const invalidStockProduct = {
      name: "Product Name",
      price: 142.67,
      stock: invalidStock,
      categoryId: category.id,
    };

    const invalidStockProductOrError = await createProductUseCase.execute(invalidStockProduct);

    const invalidPrice = 10.912;

    const invalidPriceProduct = {
      name: "Product Name",
      price: invalidPrice,
      stock: 10,
      categoryId: category.id,
    };

    const invalidPriceProductOrError = await createProductUseCase.execute(invalidPriceProduct);

    expect(invalidNameProductOrError.isLeft).toBeTruthy();
    expect(invalidNameProductOrError.value).toEqual(new InvalidProductNameError(invalidName));
    expect(invalidStockProductOrError.isLeft).toBeTruthy();
    expect(invalidStockProductOrError.value).toEqual(new InvalidProductStockError(invalidStock));
    expect(invalidPriceProductOrError.isLeft).toBeTruthy();
    expect(invalidPriceProductOrError.value).toEqual(new InvalidProductPriceError(invalidPrice));
  });
});