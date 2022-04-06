import { container } from "tsyringe";

import { JwtAuthenticationTokenProvider } from "../../src/infra/authentication/JwtAuthenticationTokenProvider";
import { EnsureAuthenticated } from "../../src/middlewares/ensureAuthenticatedMiddleware";
import { IAuthenticationTokenProvider } from "../../src/useCases/authentication/ports/IAuthenticationTokenProvider";
import { IUsersRepository } from "../../src/useCases/authentication/ports/IUsersRepository";
import { UsersRepositoryInMemory } from "../doubles/repositories/UsersRepositoryInMemory";
import { UsersActions } from "../doubles/UsersActions";

describe("Ensure Authenticated Middleware", () => {
  beforeEach(() => {
    container.registerSingleton<IAuthenticationTokenProvider>("AuthenticationTokenProvider", JwtAuthenticationTokenProvider);
    container.registerSingleton<IUsersRepository>("UsersRepository", UsersRepositoryInMemory);
  })

  it("should return user id if the user is authenticated", async () => {
    const ensureAuthenticatedMiddleware = container.resolve(EnsureAuthenticated);
    const usersActions = container.resolve(UsersActions);

    const id = "fake-id";

    const user = await usersActions.create({
      id,
      name: "John",
      email: "john@example.com",
      password: "password",
      createdAt: new Date(),
      updatedAt: new Date(),
      isAdmin: false,
    });

    const authenticationTokenProvider = new JwtAuthenticationTokenProvider();
    const fakeToken = authenticationTokenProvider.generateToken("fake-id");

    const fakeRequest = {
      headers: {
        authorization: `Bearer ${fakeToken}`
      }
    }

    const response = await ensureAuthenticatedMiddleware.handle(fakeRequest);

    const expectedResponse = {
      id,
      name: user.name,
      email: user.email,
    }

    expect(response.value).toEqual(expectedResponse);
  });

  it("should return false if the token is missing", async () => {
    const ensureAuthenticatedMiddleware = container.resolve(EnsureAuthenticated);

    const fakeRequest = {
      headers: {
        authorization: ''
      }
    }

    const response = await ensureAuthenticatedMiddleware.handle(fakeRequest);

    expect(response.value).toEqual(false);
  });

  it("should return false if the token is invalid", async () => {
    const ensureAuthenticatedMiddleware = container.resolve(EnsureAuthenticated);

    const fakeRequest = {
      headers: {
        authorization: 'Bearer invalid-token'
      }
    };

    const response = await ensureAuthenticatedMiddleware.handle(fakeRequest);

    expect(response.value).toEqual(false);
  });
})
