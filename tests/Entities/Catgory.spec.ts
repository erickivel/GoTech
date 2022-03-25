import { Category } from "../../src/domain/entities/Category";

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

  // it("should not create a user with an invalid name", () => {
  //   const largeName = "n".repeat(256);

  //   const userWithLargeName = {
  //     name: largeName,
  //     email: "fake.email@example.com",
  //     password: "password",
  //   };

  //   const createdUserWithLargeName = User.create(userWithLargeName);

  //   const userWithShortName = {
  //     name: "1",
  //     email: "fake.email@example.com",
  //     password: "password",
  //   };

  //   const createdUserWithShortName = User.create(userWithShortName);

  //   expect(createdUserWithLargeName.value).toEqual(
  //     new InvalidNameError(userWithLargeName.name)
  //   );
  //   expect(createdUserWithShortName.value).toEqual(
  //     new InvalidNameError(userWithShortName.name)
  //   );
  // });

  // it("should not create a user with an invalid email", () => {
  //   const userWithInvalidEmail = {
  //     name: "Valid Name",
  //     email: "invalid_email",
  //     password: "password",
  //   };

  //   const createdUserWithInvalidEmail = User.create(userWithInvalidEmail);

  //   const largeDomain = "c".repeat(70);

  //   const userWithLargeEmail = {
  //     name: "Valid Name",
  //     email: `invalid@${largeDomain}.com`,
  //     password: "password",
  //   };

  //   const createdUserWithLargeEmail = User.create(userWithLargeEmail);

  //   const largeEmail = "c".repeat(260);

  //   const userWithoutEmail = {
  //     name: "Valid Name",
  //     email: `email@${largeEmail}.com`,
  //     password: "password",
  //   };

  //   const createdUserWithoutEmail = User.create(userWithoutEmail);

  //   expect(createdUserWithInvalidEmail.value).toEqual(
  //     new InvalidEmailError(userWithInvalidEmail.email)
  //   );
  //   expect(createdUserWithLargeEmail.value).toEqual(
  //     new InvalidEmailError(userWithLargeEmail.email)
  //   );
  //   expect(createdUserWithoutEmail.value).toEqual(
  //     new InvalidEmailError(userWithoutEmail.email)
  //   );
  // });

  // it("should not create a user with an invalid password", () => {
  //   const shortPassword = "short";

  //   const user = {
  //     id: "fake-id",
  //     name: "Valid Name",
  //     email: "valid@email.com",
  //     password: shortPassword,
  //   };

  //   const createdUser = User.create(user);

  //   expect(createdUser.value).toEqual(new InvalidPasswordError());
  // });
});
