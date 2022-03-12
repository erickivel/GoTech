import { InvalidEmailError } from "../../../src/domain/entities/errors/InvalidEmailError";
import { InvalidNameError } from "../../../src/domain/entities/errors/InvalidNameError";
import { InvalidPasswordError } from "../../../src/domain/entities/errors/InvalidPasswordError";
import { CreateUserUseCase } from "../../../src/useCases/users/CreateUserUseCase";
import { UserAlreadyExistsError } from "../../../src/useCases/users/errors/UserAlreadyExistsError";
import { FakeEncoder } from "../../doubles/FakeEncoder";
import { UsersRepositoryInMemory } from "../../doubles/repositories/UsersRepositoryInMemory";

describe("Create User UseCase", () => {
  let usersRepositoryInMemory: UsersRepositoryInMemory;
  let fakeEncoder: FakeEncoder;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    fakeEncoder = new FakeEncoder();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory, fakeEncoder);
  });

  it("should be able to create a new user", async () => {
    const user = {
      name: "John",
      email: "john@example.com",
      password: "password",
    };

    const userOrError = await createUserUseCase.execute(user);

    const createdUser = await usersRepositoryInMemory.findByEmail(user.email);

    expect(userOrError.isRight()).toBe(true);
    expect(createdUser).toHaveProperty("id");
    expect(createdUser?.password).not.toBe(user.password);
  });

  it("should not be able to create a new user if the user already exists", async () => {
    const user = {
      name: "John",
      email: "john@example.com",
      password: "password",
    };

    await createUserUseCase.execute(user);

    const theSameUser = await createUserUseCase.execute(user);

    expect(theSameUser.isLeft()).toBe(true);
    expect(theSameUser.value).toEqual(new UserAlreadyExistsError(user.email));
  });

  it("should not be able to create a new user if invalid email is provided", async () => {
    const user = {
      name: "John",
      email: "invalid-email.com",
      password: "password",
    };

    const userOrError = await createUserUseCase.execute(user);

    expect(userOrError.isLeft()).toBe(true);
    expect(userOrError.value).toEqual(new InvalidEmailError(user.email));
  });

  it("should not be able to create a new user if invalid name is provided", async () => {
    const user = {
      name: "",
      email: "john@example.com",
      password: "password",
    };

    const userOrError = await createUserUseCase.execute(user);

    expect(userOrError.isLeft()).toBe(true);
    expect(userOrError.value).toEqual(new InvalidNameError(user.name));
  });

  it("should not be able to create a new user if invalid password is provided", async () => {
    const user = {
      name: "John",
      email: "john@example.com",
      password: "short",
    };

    const userOrError = await createUserUseCase.execute(user);

    expect(userOrError.isLeft()).toBe(true);
    expect(userOrError.value).toEqual(new InvalidPasswordError());
  });
});
