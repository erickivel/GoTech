import { InvalidEmailError } from "../../../src/domain/entities/errors/InvalidEmailError";
import { InvalidNameError } from "../../../src/domain/entities/errors/InvalidNameError";
import { InvalidPasswordError } from "../../../src/domain/entities/errors/InvalidPasswordError";
import { BcryptEncoder } from "../../../src/infra/encoder/BcryptEncoder";
import { EmailIsAlreadyTakenError } from "../../../src/useCases/users/errors/EmailIsAlreadyTakenError";
import { IncorrectPasswordError } from "../../../src/useCases/users/errors/IncorrectPasswordError";
import { UnmatchedPasswordError } from "../../../src/useCases/users/errors/UnmatchedPasswordError";
import { UserNotFoundError } from "../../../src/useCases/users/errors/UserNotFoundError";
import { UpdateUserUseCase } from "../../../src/useCases/users/UpdateUserUseCase";
import { UsersRepositoryInMemory } from "../../doubles/repositories/UsersRepositoryInMemory";

let usersRepositoryInMemory: UsersRepositoryInMemory;
let bcryptEncoder: BcryptEncoder;
let updateUserUseCase: UpdateUserUseCase;

describe("Update User UseCase", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    bcryptEncoder = new BcryptEncoder();
    updateUserUseCase = new UpdateUserUseCase(
      usersRepositoryInMemory, bcryptEncoder
    );
  })

  it("should return user updated when new email and name is provided", async () => {
    const hashedPassword = await bcryptEncoder.encode("password");

    await usersRepositoryInMemory.create({
      id: "fake-id",
      name: "John",
      email: "john@example.com",
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      isAdmin: false,
    });

    const resultOrError = await updateUserUseCase.execute({
      user_id: "fake-id",
      name: "New Name",
      email: "new-email@example.com",
    });

    const expectedResponse = {
      id: "fake-id",
      name: "New Name",
      email: "new-email@example.com",
    };

    expect(resultOrError.isRight()).toEqual(true);
    expect(resultOrError.value).toEqual(expectedResponse);
  });

  it("should return user updated when new password is provided", async () => {
    const hashedPassword = await bcryptEncoder.encode("password");

    const userCreated = await usersRepositoryInMemory.create({
      id: "fake-id",
      name: "John",
      email: "john@example.com",
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      isAdmin: false,
    });

    const resultOrError = await updateUserUseCase.execute({
      user_id: "fake-id",
      name: "New Name",
      email: "new-email@example.com",
      old_password: "password",
      new_password: "new-password",
      confirm_password: "new-password"
    });

    const expectedResponse = {
      id: "fake-id",
      name: "New Name",
      email: "new-email@example.com",
    };

    const userUpdated = await usersRepositoryInMemory.findById("fake-id");

    if (!userUpdated) {
      throw new Error("User Not Found");
    }

    const passwordHasChanged = await bcryptEncoder.compare("new-password", userUpdated.password);

    expect(userCreated.updatedAt).not.toEqual(userUpdated.updatedAt);
    expect(resultOrError.isRight()).toEqual(true);
    expect(resultOrError.value).toEqual(expectedResponse);
    expect(passwordHasChanged).toBeTruthy();
  });

  it("should not update user if the user doesn't exist", async () => {
    const hashedPassword = await bcryptEncoder.encode("password");

    await usersRepositoryInMemory.create({
      id: "fake-id",
      name: "John",
      email: "john@example.com",
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      isAdmin: false,
    });

    const invalidId = "invalid-id"

    const resultOrError = await updateUserUseCase.execute({
      user_id: invalidId,
      name: "New Name",
      email: "new-email@example.com",
      old_password: "password",
      new_password: "new-password",
      confirm_password: "new-password"
    });

    expect(resultOrError.isLeft()).toEqual(true);
    expect(resultOrError.value).toEqual(new UserNotFoundError(invalidId));
  });

  it("should not update user if the provided password is incorrect", async () => {
    const hashedPassword = await bcryptEncoder.encode("password");

    await usersRepositoryInMemory.create({
      id: "fake-id",
      name: "John",
      email: "john@example.com",
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      isAdmin: false,
    });

    const resultOrError = await updateUserUseCase.execute({
      user_id: "fake-id",
      name: "New Name",
      email: "new-email@example.com",
      old_password: "wrong-password",
      new_password: "new-password",
      confirm_password: "new-password"
    });

    expect(resultOrError.isLeft()).toEqual(true);
    expect(resultOrError.value).toEqual(new IncorrectPasswordError());
  });

  it("should not update user if the new password doesn't match the confirmation password", async () => {
    const hashedPassword = await bcryptEncoder.encode("password");

    await usersRepositoryInMemory.create({
      id: "fake-id",
      name: "John",
      email: "john@example.com",
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      isAdmin: false,
    });

    const resultOrError = await updateUserUseCase.execute({
      user_id: "fake-id",
      name: "New Name",
      email: "new-email@example.com",
      old_password: "password",
      new_password: "new-password",
      confirm_password: "different-new-password"
    });

    expect(resultOrError.isLeft()).toEqual(true);
    expect(resultOrError.value).toEqual(new UnmatchedPasswordError());
  });

  it("should not update user if the new email is already in use", async () => {
    const hashedPassword = await bcryptEncoder.encode("password");

    await usersRepositoryInMemory.create({
      id: "1",
      name: "User 1",
      email: "user1@example.com",
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      isAdmin: false,
    });

    await usersRepositoryInMemory.create({
      id: "2",
      name: "User 2",
      email: "user2@example.com",
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      isAdmin: false,
    });

    const resultOrError = await updateUserUseCase.execute({
      user_id: "1",
      name: "User 1",
      email: "user2@example.com",
    });

    expect(resultOrError.isLeft()).toEqual(true);
    expect(resultOrError.value).toEqual(new EmailIsAlreadyTakenError("user2@example.com"));
  });

  it("should not be able to update the user if invalid email is provided", async () => {
    const hashedPassword = await bcryptEncoder.encode("password");

    await usersRepositoryInMemory.create({
      id: "fake-id",
      name: "John",
      email: "john@example.com",
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      isAdmin: false,
    });

    const invalidEmail = "invalidEmail.com";

    const resultOrError = await updateUserUseCase.execute({
      user_id: "fake-id",
      name: "John",
      email: invalidEmail,
    });

    expect(resultOrError.isLeft()).toEqual(true);
    expect(resultOrError.value).toEqual(new InvalidEmailError(invalidEmail));
  });

  it("should not be able to update the user if invalid name is provided", async () => {
    const hashedPassword = await bcryptEncoder.encode("password");

    await usersRepositoryInMemory.create({
      id: "fake-id",
      name: "John",
      email: "john@example.com",
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      isAdmin: false,
    });

    const invalidName = "a";

    const resultOrError = await updateUserUseCase.execute({
      user_id: "fake-id",
      name: invalidName,
      email: "john@example.com",
    });

    expect(resultOrError.isLeft()).toEqual(true);
    expect(resultOrError.value).toEqual(new InvalidNameError(invalidName));
  });

  it("should not be able to update the user if invalid name is provided", async () => {
    const hashedPassword = await bcryptEncoder.encode("password");

    await usersRepositoryInMemory.create({
      id: "fake-id",
      name: "John",
      email: "john@example.com",
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      isAdmin: false,
    });

    const invalidPassword = "short";

    const resultOrError = await updateUserUseCase.execute({
      user_id: "fake-id",
      name: "New Name",
      email: "new-email@example.com",
      old_password: "password",
      new_password: invalidPassword,
      confirm_password: invalidPassword,
    });

    expect(resultOrError.isLeft()).toEqual(true);
    expect(resultOrError.value).toEqual(new InvalidPasswordError());
  });
});