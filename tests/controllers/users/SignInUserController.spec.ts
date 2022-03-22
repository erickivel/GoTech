import { container } from "tsyringe";

import { SignInUserController } from "../../../src/controllers/users/SignInUserController";
import { JwtAuthenticationTokenProvider } from "../../../src/infra/authentication/JwtAuthenticationTokenProvider";
import { BcryptEncoder } from "../../../src/infra/encoder/BcryptEncoder";
import { CreateUserUseCase } from "../../../src/useCases/users/CreateUserUseCase";
import { IAuthenticationTokenProvider } from "../../../src/useCases/users/ports/IAuthenticationTokenProvider";
import { IEncoder } from "../../../src/useCases/users/ports/IEncoder";
import { IUsersRepository } from "../../../src/useCases/users/ports/IUsersRepository";
import { UsersRepositoryInMemory } from "../../doubles/repositories/UsersRepositoryInMemory";

describe("SignIn User Controller", () => {
  let signInUserController: SignInUserController;

  beforeEach(() => {
    container.registerSingleton<IUsersRepository>("UsersRepository", UsersRepositoryInMemory);
    container.registerSingleton<IEncoder>("Encoder", BcryptEncoder);
    container.registerSingleton<IAuthenticationTokenProvider>("AuthenticationTokenProvider", JwtAuthenticationTokenProvider);
    signInUserController = new SignInUserController();
  });

  afterAll(() => {
    container.clearInstances();
  });


  it("should return status code 200, user and token on body if user is successfully authenticated", async () => {
    const createUserUseCase = container.resolve(CreateUserUseCase);

    await createUserUseCase.execute({
      name: "John",
      email: "john@example.com",
      password: "password",
    });

    const fakeRequest = {
      body: {
        email: "john@example.com",
        password: "password"
      }
    }

    const result = await signInUserController.handle(fakeRequest);

    expect(result.statusCode).toBe(200);
    expect(result.body).toHaveProperty("user");
    expect(result.body).toHaveProperty("token");
  });

  it("should return status code 403 when trying sign in with incorrect email", async () => {
    const createUserUseCase = container.resolve(CreateUserUseCase);

    await createUserUseCase.execute({
      name: "John",
      email: "john@example.com",
      password: "password",
    });

    const fakeRequest = {
      body: {
        email: "wrong_email@example.com",
        password: "password"
      }
    }

    const result = await signInUserController.handle(fakeRequest);

    expect(result.statusCode).toBe(403);
    expect(result.body).toEqual("Email or password incorrect");
  });

  it("should return status code 403 when trying sign in with incorrect password", async () => {
    const createUserUseCase = container.resolve(CreateUserUseCase);

    await createUserUseCase.execute({
      name: "John",
      email: "john@example.com",
      password: "password",
    });

    const fakeRequest = {
      body: {
        email: "john@example.com",
        password: "wrong_password"
      }
    }

    const result = await signInUserController.handle(fakeRequest);

    expect(result.statusCode).toBe(403);
    expect(result.body).toEqual("Email or password incorrect");
  });

  it("should return status code 400 when the email is missing", async () => {
    const fakeRequest = {
      body: {
        password: "password"
      }
    }

    const result = await signInUserController.handle(fakeRequest);

    expect(result.statusCode).toBe(400);
    expect(result.body).toEqual("Missing parameter(s): email.")
  });

  it("should return status code 400 when the password is missing", async () => {
    const fakeRequest = {
      body: {
        email: "john@example.com",
      }
    }

    const result = await signInUserController.handle(fakeRequest);

    expect(result.statusCode).toBe(400);
    expect(result.body).toEqual("Missing parameter(s): password.")
  });

  it("should return status code 400 when the email and password are missing", async () => {
    const fakeRequest = {
      body: {
      }
    }

    const result = await signInUserController.handle(fakeRequest);

    expect(result.statusCode).toBe(400);
    expect(result.body).toEqual("Missing parameter(s): email, password.")
  });
})