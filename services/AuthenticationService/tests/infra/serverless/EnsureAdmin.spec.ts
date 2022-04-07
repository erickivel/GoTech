import { JwtAuthenticationTokenProvider } from "../../../src/infra/authentication/JwtAuthenticationTokenProvider";
import { prismaClient } from "../../../src/infra/database/prisma/PrismaClient";
import { handle } from "../../../src/infra/serverless/functions/EnsureAdmin";

describe("Ensure Admin Serverless Function", () => {
  let dateNow: Date;
  let jwt: string;

  beforeAll(async () => {
    dateNow = new Date();
    const jwtAuthenticationProvider = new JwtAuthenticationTokenProvider()
    jwt = jwtAuthenticationProvider.generateToken("admin-id");

    await prismaClient.$connect();
    await prismaClient.users.create({
      data: {
        id: "admin-id",
        name: "Admin",
        email: "admin@example.com",
        password: "password",
        isAdmin: true,
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
          "id": "admin-id",
          "name": "Admin",
          "email": "admin@example.com"
        },
      },
    }

    expect(placeOrderServerless).toEqual(expectedResponse);
  });
});