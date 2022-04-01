import { container } from "tsyringe";

import { JwtAuthenticationTokenProvider } from "../../src/infra/authentication/JwtAuthenticationTokenProvider";
import { EnsureAuthenticated } from "../../src/middlewares/ensureAuthenticated";
import { IAuthenticationTokenProvider } from "../../src/useCases/users/ports/IAuthenticationTokenProvider";

describe("Ensure Authenticated Middleware", () => {
  beforeEach(() => {
    container.registerSingleton<IAuthenticationTokenProvider>("AuthenticationTokenProvider", JwtAuthenticationTokenProvider);
  })

  it("should return status code 200 and successful message if the user is authenticated", async () => {
    const ensureAuthenticatedMiddleware = container.resolve(EnsureAuthenticated);

    const authenticationTokenProvider = new JwtAuthenticationTokenProvider();
    const fakeToken = authenticationTokenProvider.generateToken("fake-id");

    const fakeRequest = {
      headers: {
        authorization: `Bearer ${fakeToken}`
      }
    }

    const response = await ensureAuthenticatedMiddleware.handle(fakeRequest);

    expect(response.body).toEqual("User is authenticated!");
    expect(response.statusCode).toEqual(200);
  });

  it("should return status code 401 if the token is missing", async () => {
    const ensureAuthenticatedMiddleware = container.resolve(EnsureAuthenticated);

    const fakeRequest = {
      headers: {
        authorization: ''
      }
    }

    const response = await ensureAuthenticatedMiddleware.handle(fakeRequest);

    expect(response.body).toEqual("Token is missing!");
    expect(response.statusCode).toEqual(401);
  });

  it("should return status code 401 if the token is invalid", async () => {
    const ensureAuthenticatedMiddleware = container.resolve(EnsureAuthenticated);

    const fakeRequest = {
      headers: {
        authorization: 'Bearer invalid-token'
      }
    };

    const response = await ensureAuthenticatedMiddleware.handle(fakeRequest);

    expect(response.body).toEqual("Token is invalid!");
    expect(response.statusCode).toEqual(401);
  });
})
