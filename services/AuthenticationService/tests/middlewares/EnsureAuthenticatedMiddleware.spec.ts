import { container } from "tsyringe";

import { JwtAuthenticationTokenProvider } from "../../src/infra/authentication/JwtAuthenticationTokenProvider";
import { EnsureAuthenticated } from "../../src/middlewares/ensureAuthenticatedMiddleware";
import { IAuthenticationTokenProvider } from "../../src/useCases/authentication/ports/IAuthenticationTokenProvider";

describe("Ensure Authenticated Middleware", () => {
  beforeEach(() => {
    container.registerSingleton<IAuthenticationTokenProvider>("AuthenticationTokenProvider", JwtAuthenticationTokenProvider);
  })

  it("should return user id if the user is authenticated", async () => {
    const ensureAuthenticatedMiddleware = container.resolve(EnsureAuthenticated);

    const authenticationTokenProvider = new JwtAuthenticationTokenProvider();
    const fakeToken = authenticationTokenProvider.generateToken("fake-id");

    const fakeRequest = {
      headers: {
        authorization: `Bearer ${fakeToken}`
      }
    }

    const response = await ensureAuthenticatedMiddleware.handle(fakeRequest);

    expect(response.value).toEqual("fake-id");
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
