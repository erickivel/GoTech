import { Category } from "../../src/domain/entities/Category";
import { InvalidCategoryNameError } from "../../src/domain/entities/Category/errors/InvalidCategoryNameError";

describe("Category Validator", () => {
  it("should create a category", () => {
    const category = {
      name: "Valid Category Name",
    };

    const createdCategoryOrError = Category.create(category);

    const dateNow = new Date();

    const categoryWithAllParams = {
      id: "fake-id",
      name: "Valid Category Name",
      createdAt: dateNow,
      updatedAt: dateNow,
    };

    const createdCategoryWithAllParamsOrError = Category.create(categoryWithAllParams);

    expect(createdCategoryOrError.isRight()).toBeTruthy();
    expect(createdCategoryOrError.value).toMatchObject(category);
    expect(createdCategoryWithAllParamsOrError.isRight()).toBeTruthy();
    expect(createdCategoryWithAllParamsOrError.value).toEqual(categoryWithAllParams);
  });

  it("should not create a category with invalid category", () => {
    const shortName = "a"

    const shortNameCategory = {
      name: shortName,
    };

    const shortNameCreatedCategoryOrError = Category.create(shortNameCategory);

    const largeName = "n".repeat(256);

    const largeNameCategory = {
      name: largeName
    };

    const largeNameCategoryOrError = Category.create(largeNameCategory);

    expect(shortNameCreatedCategoryOrError.isLeft()).toBeTruthy();
    expect(shortNameCreatedCategoryOrError.value).toEqual(new InvalidCategoryNameError(shortName));
    expect(largeNameCategoryOrError.isLeft()).toBeTruthy();
    expect(largeNameCategoryOrError.value).toEqual(new InvalidCategoryNameError(largeName));
  });
});
