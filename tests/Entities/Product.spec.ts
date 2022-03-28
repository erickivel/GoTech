import { Product } from "../../src/domain/entities/Product";
import { InvalidProductNameError } from "../../src/domain/entities/Product/errors/InvalidProductNameError";
import { InvalidProductPriceError } from "../../src/domain/entities/Product/errors/InvalidProductPriceError";
import { InvalidProductStockError } from "../../src/domain/entities/Product/errors/InvalidProductStockError";

describe("Product Validator", () => {
  it("should create a product", () => {
    const product = {
      name: "Valid Product Name",
      price: 120.95,
      stock: 100,
    };

    const createdProductOrError = Product.create(product);

    const dateNow = new Date();

    const productWithAllParams = {
      id: "fake-id",
      name: "Valid Product Name",
      price: 100,
      stock: 10,
      categoryId: "fake-category-id",
      createdAt: dateNow,
      updatedAt: dateNow,
    };

    const createdProductWithAllParamsOrError = Product.create(productWithAllParams);

    expect(createdProductOrError.isRight()).toBeTruthy();
    expect(createdProductOrError.value).toMatchObject(product);
    expect(createdProductWithAllParamsOrError.isRight()).toBeTruthy();
    expect(createdProductWithAllParamsOrError.value).toEqual(productWithAllParams);
  });

  it("should not create a product if name is invalid", () => {
    const shortName = "a";

    const shortNameProduct = {
      name: shortName,
      price: 120.95,
      stock: 100,
    };

    const createdShortNameProductOrError = Product.create(shortNameProduct);

    const largeName = "a".repeat(256);

    const largeNameProduct = {
      name: largeName,
      price: 120.95,
      stock: 100,
    };

    const createdLargeNameProductOrError = Product.create(largeNameProduct);

    expect(createdShortNameProductOrError.isLeft()).toBeTruthy();
    expect(createdShortNameProductOrError.value).toEqual(new InvalidProductNameError(shortName));
    expect(createdLargeNameProductOrError.isLeft()).toBeTruthy();
    expect(createdLargeNameProductOrError.value).toEqual(new InvalidProductNameError(largeName));
  });

  it("should not create a product if stock is invalid", () => {
    const decimalStock = 42.07;

    const decimalStockProduct = {
      name: "Valid Product Name",
      price: 120.95,
      stock: decimalStock,
    };

    const createdDecimalStockProductOrError = Product.create(decimalStockProduct);

    const negativeStock = -42;

    const negativeStockProduct = {
      name: "Valid Product Name",
      price: 120.95,
      stock: negativeStock,
    };

    const createdNegativeStockProductOrError = Product.create(negativeStockProduct);

    expect(createdDecimalStockProductOrError.isLeft()).toBeTruthy();
    expect(createdDecimalStockProductOrError.value).toEqual(new InvalidProductStockError(decimalStock));
    expect(createdNegativeStockProductOrError.isLeft()).toBeTruthy();
    expect(createdNegativeStockProductOrError.value).toEqual(new InvalidProductStockError(negativeStock));
  });

  it("should not create a product if price is invalid", () => {
    const invalidPrice = 42.076;

    const invalidPriceProduct = {
      name: "Valid Product Name",
      price: invalidPrice,
      stock: 10,
    };

    const createdInvalidPriceProductOrError = Product.create(invalidPriceProduct);

    const negativePrice = -42;

    const negativePriceProduct = {
      name: "Valid Product Name",
      price: negativePrice,
      stock: 10,
    };

    const createdNegativePriceProductOrError = Product.create(negativePriceProduct);

    expect(createdInvalidPriceProductOrError.isLeft()).toBeTruthy();
    expect(createdInvalidPriceProductOrError.value).toEqual(new InvalidProductPriceError(invalidPrice));
    expect(createdNegativePriceProductOrError.isLeft()).toBeTruthy();
    expect(createdNegativePriceProductOrError.value).toEqual(new InvalidProductPriceError(-42));
  });
});
