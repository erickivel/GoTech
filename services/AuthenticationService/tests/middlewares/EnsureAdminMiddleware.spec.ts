import { container } from "tsyringe";

import { JwtAuthenticationTokenProvider } from "../../src/infra/authentication/JwtAuthenticationTokenProvider";
import { EnsureAdmin } from "../../src/middlewares/ensureAdminMiddleware";
import { IAuthenticationTokenProvider } from "../../src/useCases/authentication/ports/IAuthenticationTokenProvider";
import { IUsersRepository } from "../../src/useCases/authentication/ports/IUsersRepository";
import { UsersRepositoryInMemory } from "../doubles/repositories/UsersRepositoryInMemory";
import { UsersActions } from "../doubles/UsersActions";

describe("Ensure Authenticated Middleware", () => {
  beforeEach(() => {
    container.registerSingleton<IAuthenticationTokenProvider>("AuthenticationTokenProvider", JwtAuthenticationTokenProvider);
    container.registerSingleton<IUsersRepository>("UsersRepository", UsersRepositoryInMemory);
  })

  it("should return user id if the user is authenticated and is an admin", async () => {
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

    expect(response.value).toEqual(id);
  });

  it("should return false if the token is missing", async () => {
    const ensureAdminMiddleware = container.resolve(EnsureAdmin);

    const fakeRequest = {
      headers: {
        authorization: ''
      }
    }

    const response = await ensureAdminMiddleware.handle(fakeRequest);

    expect(response.value).toEqual(false);
  });

  it("should return false if the token is invalid", async () => {
    const ensureAdminMiddleware = container.resolve(EnsureAdmin);

    const fakeRequest = {
      headers: {
        authorization: 'Bearer invalid-token'
      }
    };

    const response = await ensureAdminMiddleware.handle(fakeRequest);

    expect(response.value).toEqual(false);
  });

  it("should return false if the user doesn't exist", async () => {
    const ensureAdminMiddleware = container.resolve(EnsureAdmin);

    const authenticationTokenProvider = new JwtAuthenticationTokenProvider();
    const fakeToken = authenticationTokenProvider.generateToken("not-existent-id");

    const fakeRequest = {
      headers: {
        authorization: `Bearer ${fakeToken}`
      }
    }

    const response = await ensureAdminMiddleware.handle(fakeRequest);

    expect(response.value).toEqual(false);
  });

  it("should return false if user is not an admin", async () => {
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

    expect(response.value).toEqual(false);
  });
})
