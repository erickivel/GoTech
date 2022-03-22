import { container } from "tsyringe";

import { UserProfileController } from "../../../src/controllers/users/UserProfileController";
import { JwtAuthenticationTokenProvider } from "../../../src/infra/authentication/JwtAuthenticationTokenProvider";
import { BcryptEncoder } from "../../../src/infra/encoder/BcryptEncoder";
import { CreateUserUseCase } from "../../../src/useCases/users/CreateUserUseCase";
import { IAuthenticationTokenProvider } from "../../../src/useCases/users/ports/IAuthenticationTokenProvider";
import { IEncoder } from "../../../src/useCases/users/ports/IEncoder";
import { IUsersRepository } from "../../../src/useCases/users/ports/IUsersRepository";
import { UsersRepositoryInMemory } from "../../doubles/repositories/UsersRepositoryInMemory";

describe("User Profile Controller", () => {
  let userProfileController: UserProfileController;

  beforeEach(() => {
    container.registerSingleton<IUsersRepository>("UsersRepository", UsersRepositoryInMemory);
    container.registerSingleton<IEncoder>("Encoder", BcryptEncoder);
    container.registerSingleton<IAuthenticationTokenProvider>("AuthenticationTokenProvider", JwtAuthenticationTokenProvider);
    userProfileController = new UserProfileController();
  });

  afterAll(() => {
    container.clearInstances();
  });


  it("should return status code 200 and user data if user is authenticated", async () => {
    const createUserUseCase = container.resolve(CreateUserUseCase);

    const resultOrError = await createUserUseCase.execute({
      name: "John",
      email: "john@example.com",
      password: "password",
    });

    if (!resultOrError.isRight()) {
      throw new Error("CreateUserUseCase error")
    };

    const userId = resultOrError.value.id;

    const fakeRequest = {
      user: {
        id: userId,
      }
    }

    const result = await userProfileController.handle(fakeRequest);

    const expectedResponse = {
      id: userId,
      name: "John",
      email: "john@example.com",
    };

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(expectedResponse);
  });

  it("should return status code 403 when trying to see user profile with invalid id", async () => {
    const createUserUseCase = container.resolve(CreateUserUseCase);

    await createUserUseCase.execute({
      name: "John",
      email: "john@example.com",
      password: "password",
    });

    const fakeRequest = {
      user: {
        id: "invalid-id",
      }
    };

    const result = await userProfileController.handle(fakeRequest);

    expect(result.statusCode).toBe(403);
    expect(result.body).toEqual(`User with id "invalid-id" not found`);
  });

  it("should return status code 400 when the id is missing", async () => {
    const createUserUseCase = container.resolve(CreateUserUseCase);

    await createUserUseCase.execute({
      name: "John",
      email: "john@example.com",
      password: "password",
    });

    const fakeRequest = {
    }

    const result = await userProfileController.handle(fakeRequest);

    expect(result.statusCode).toBe(400);
    expect(result.body).toEqual("Missing parameter(s): user id.")
  });
});