import { InvalidEmailError } from "../../src/domain/entities/errors/InvalidEmailError";
import { InvalidNameError } from "../../src/domain/entities/errors/InvalidNameError";
import { InvalidPasswordError } from "../../src/domain/entities/errors/InvalidPasswordError";
import { User } from "../../src/domain/entities/User";

describe("User Validator", () => {
  it("should create a user", () => {
    const user = {
      name: "Valid Name",
      email: "fake.email@example.com",
      password: "password",
    };

    const createdUser = User.create(user);

    expect(createdUser.value).toMatchObject(user);
  });

  it("should not create a user with an invalid name", () => {
    const largeName = "n".repeat(256);

    const userWithLargeName = {
      name: largeName,
      email: "fake.email@example.com",
      password: "password",
    };

    const createdUserWithLargeName = User.create(userWithLargeName);

    const userWithShortName = {
      name: "1",
      email: "fake.email@example.com",
      password: "password",
    };

    const createdUserWithShortName = User.create(userWithShortName);

    expect(createdUserWithLargeName.value).toEqual(
      new InvalidNameError(userWithLargeName.name)
    );
    expect(createdUserWithShortName.value).toEqual(
      new InvalidNameError(userWithShortName.name)
    );
  });

  it("should not create a user with an invalid email", () => {
    const userWithInvalidEmail = {
      name: "Valid Name",
      email: "invalid_email",
      password: "password",
    };

    const createdUserWithInvalidEmail = User.create(userWithInvalidEmail);

    const largeDomain = "c".repeat(70);

    const userWithLargeEmail = {
      name: "Valid Name",
      email: `invalid@${largeDomain}.com`,
      password: "password",
    };

    const createdUserWithLargeEmail = User.create(userWithLargeEmail);

    const largeEmail = "c".repeat(260);

    const userWithoutEmail = {
      name: "Valid Name",
      email: `email@${largeEmail}.com`,
      password: "password",
    };

    const createdUserWithoutEmail = User.create(userWithoutEmail);

    expect(createdUserWithInvalidEmail.value).toEqual(
      new InvalidEmailError(userWithInvalidEmail.email)
    );
    expect(createdUserWithLargeEmail.value).toEqual(
      new InvalidEmailError(userWithLargeEmail.email)
    );
    expect(createdUserWithoutEmail.value).toEqual(
      new InvalidEmailError(userWithoutEmail.email)
    );
  });

  it("should not create a user with an invalid password", () => {
    const shortPassword = "short";

    const user = {
      id: "fake-id",
      name: "Valid Name",
      email: "valid@email.com",
      password: shortPassword,
    };

    const createdUser = User.create(user);

    expect(createdUser.value).toEqual(new InvalidPasswordError());
  });
});
