import { JwtAuthenticationTokenProvider } from "../../../src/infra/authentication/JwtAuthenticationTokenProvider";
import { prismaClient } from "../../../src/infra/database/prisma/PrismaClient";
import { handle } from "../../../src/infra/serverless/functions/EnsureAuthenticated";

describe("Ensure Authenticated Serverless Function", () => {
  let dateNow: Date;
  let jwt: string;

  beforeAll(async () => {
    dateNow = new Date();
    const jwtAuthenticationProvider = new JwtAuthenticationTokenProvider()
    jwt = jwtAuthenticationProvider.generateToken("user-id");

    await prismaClient.$connect();
    await prismaClient.users.create({
      data: {
        id: "user-id",
        name: "User",
        email: "user@example.com",
        password: "password",
        isAdmin: false,
        createdAt: dateNow,
        updatedAt: dateNow,
      }
    });
  });

  afterAll(async () => {
    await prismaClient.users.deleteMany();
    await prismaClient.$disconnect();
  });

  it("should return isAuthorized true and user data", async () => {
    const event = {
      headers: {
        authorization: `Bearer ${jwt}`
      }
    };

    const placeOrderServerless = await handle(event);

    const expectedResponse = {
      "isAuthorized": true,
      "context": {
        "user": {
          "id": "user-id",
          "name": "User",
          "email": "user@example.com"
        },
      },
    }

    expect(placeOrderServerless).toEqual(expectedResponse);
  });
});