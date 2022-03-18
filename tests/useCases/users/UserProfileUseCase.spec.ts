import { BcryptEncoder } from "../../../src/infra/encoder/BcryptEncoder";
import { UserNotFoundError } from "../../../src/useCases/users/errors/UserNotFoundError";
import { UserProfileUseCase } from "../../../src/useCases/users/UserProfileUseCase";
import { UsersRepositoryInMemory } from "../../doubles/repositories/UsersRepositoryInMemory";

let usersRepositoryInMemory: UsersRepositoryInMemory;
let userProfileUseCase: UserProfileUseCase;

describe("User Profile UseCase", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    userProfileUseCase = new UserProfileUseCase(
      usersRepositoryInMemory,
    );
  })

  it("should return user data if user is authenticated", async () => {
    const bcryptEncoder = new BcryptEncoder();
    const hashedPassword = await bcryptEncoder.encode("password");

    await usersRepositoryInMemory.create({
      id: "fake-id",
      name: "John",
      email: "john@example.com",
      password: hashedPassword,
      createdAt: new Date(),
    });

    const userOrError = await userProfileUseCase.execute({ user_id: "fake-id" });

    const expectedResponse = {
      id: "fake-id",
      name: "John",
      email: "john@example.com",
    };

    expect(userOrError.isRight()).toEqual(true);
    expect(userOrError.value).toEqual(expectedResponse);
  });

  it("should not return user data if the user id provided is invalid", async () => {
    const bcryptEncoder = new BcryptEncoder();
    const hashedPassword = await bcryptEncoder.encode("password");

    await usersRepositoryInMemory.create({
      id: "fake-id",
      name: "John",
      email: "john@example.com",
      password: hashedPassword,
      createdAt: new Date(),
    });

    const invalidId = "invalid-id";

    const userOrError = await userProfileUseCase.execute({ user_id: invalidId });

    expect(userOrError.isLeft()).toEqual(true);
    expect(userOrError.value).toEqual(new UserNotFoundError(invalidId));
  });
});