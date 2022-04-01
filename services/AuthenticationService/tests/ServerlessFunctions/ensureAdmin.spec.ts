import { container } from "tsyringe";

import { JwtAuthenticationTokenProvider } from "../../src/infra/authentication/JwtAuthenticationTokenProvider";
import { EnsureAdmin } from "../../src/middlewares/ensureAdmin";
import { IAuthenticationTokenProvider } from "../../src/useCases/users/ports/IAuthenticationTokenProvider";
import { IUsersRepository } from "../../src/useCases/users/ports/IUsersRepository";
import { UsersRepositoryInMemory } from "../doubles/repositories/UsersRepositoryInMemory";
import { UsersActions } from "../doubles/UsersActions";

describe("Ensure Authenticated Middleware", () => {
  beforeEach(() => {
    container.registerSingleton<IAuthenticationTokenProvider>("AuthenticationTokenProvider", JwtAuthenticationTokenProvider);
    container.registerSingleton<IUsersRepository>("UsersRepository", UsersRepositoryInMemory);
  })

  it("should return status code 200 and successful message if the user is authenticated and is an admin", async () => {
    const ensureAdminMiddleware = container.resolve(EnsureAdmin);
    const usersActions = container.resolve(UsersActions);

    const id = "fake-id";

    usersActions.create({
      id,
      name: "John",
      email: "john@example.com",
      password: "password",
      createdAt: new Date(),
      updatedAt: new Date(),
      isAdmin: true,
    });

    const authenticationTokenProvider = new JwtAuthenticationTokenProvider();
    const fakeToken = authenticationTokenProvider.generateToken(id);

    const fakeRequest = {
      headers: {
        authorization: `Bearer ${fakeToken}`
      }
    }

    const response = await ensureAdminMiddleware.handle(fakeRequest);

    expect(response.body).toEqual("User is authenticated!");
    expect(response.statusCode).toEqual(200);
  });

  it("should return status code 401 if the token is missing", async () => {
    const ensureAdminMiddleware = container.resolve(EnsureAdmin);

    const fakeRequest = {
      headers: {
        authorization: ''
      }
    }

    const response = await ensureAdminMiddleware.handle(fakeRequest);

    expect(response.body).toEqual("Token is missing!");
    expect(response.statusCode).toEqual(401);
  });

  it("should return status code 401 if the token is invalid", async () => {
    const ensureAdminMiddleware = container.resolve(EnsureAdmin);

    const fakeRequest = {
      headers: {
        authorization: 'Bearer invalid-token'
      }
    };

    const response = await ensureAdminMiddleware.handle(fakeRequest);

    expect(response.body).toEqual("Token is invalid!");
    expect(response.statusCode).toEqual(401);
  });

  it("should return status code 401 if the user doesn't exist", async () => {
    const ensureAdminMiddleware = container.resolve(EnsureAdmin);

    const authenticationTokenProvider = new JwtAuthenticationTokenProvider();
    const fakeToken = authenticationTokenProvider.generateToken("not-existent-id");

    const fakeRequest = {
      headers: {
        authorization: `Bearer ${fakeToken}`
      }
    }

    const response = await ensureAdminMiddleware.handle(fakeRequest);

    expect(response.statusCode).toEqual(401);
    expect(response.body).toEqual("User not found!");
  });

  it("should return status code 401 if user is not an admin", async () => {
    const ensureAdminMiddleware = container.resolve(EnsureAdmin);
    const usersActions = container.resolve(UsersActions);

    const id = "fake-id";

    usersActions.create({
      id,
      name: "John",
      email: "john@example.com",
      password: "password",
      createdAt: new Date(),
      updatedAt: new Date(),
      isAdmin: false,
    });

    const authenticationTokenProvider = new JwtAuthenticationTokenProvider();
    const fakeToken = authenticationTokenProvider.generateToken(id);

    const fakeRequest = {
      headers: {
        authorization: `Bearer ${fakeToken}`
      }
    }

    const response = await ensureAdminMiddleware.handle(fakeRequest);

    expect(response.statusCode).toEqual(401);
    expect(response.body).toEqual("User is not an admin!");
  });
})
