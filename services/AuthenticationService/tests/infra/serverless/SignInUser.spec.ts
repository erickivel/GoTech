import { Context } from "aws-lambda";
import { JwtAuthenticationTokenProvider } from "../../../src/infra/authentication/JwtAuthenticationTokenProvider";
import { prismaClient } from "../../../src/infra/database/prisma/PrismaClient";
import { BcryptEncoder } from "../../../src/infra/encoder/BcryptEncoder";
import { handle } from "../../../src/infra/serverless/functions/SignInUser";

describe("SignIn User Serverless Function", () => {
  let dateNow: Date;

  beforeAll(async () => {
    dateNow = new Date();
    const bcryptEncoder = new BcryptEncoder()
    const hashedPassword = await bcryptEncoder.encode("user-password");

    await prismaClient.$connect();
    await prismaClient.users.create({
      data: {
        id: "user-id",
        name: "User",
        email: "user@example.com",
        password: hashedPassword,
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

  it("should return status code 200 and user and token on the body", async () => {
    const event = {
      body: {
        email: "user@example.com",
        password: "user-password",
      }
    };

    const context = {} as Context;

    const signInUserServerless = await handle(event, context);

    const bodyParsed = JSON.parse(signInUserServerless.body);

    expect(bodyParsed).toHaveProperty("user");
    expect(bodyParsed.user.name).toEqual("User");
    expect(bodyParsed).toHaveProperty("token");
    expect(signInUserServerless.statusCode).toEqual(200);
  });
});