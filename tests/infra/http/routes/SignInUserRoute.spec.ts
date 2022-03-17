import request from 'supertest';

import { prismaClient } from '../../../../src/infra/database/prisma/PrismaClient';
import { BcryptEncoder } from "../../../../src/infra/encoder/BcryptEncoder";
import { app } from '../../../../src/infra/http/app';

describe("SignIn User Route", () => {
  beforeAll(async () => {
    const bcryptEncoder = new BcryptEncoder();

    const hashedPassword = await bcryptEncoder.encode("password");

    await prismaClient.$connect();
    await prismaClient.users.create({
      data: {
        id: "fake id",
        email: "user@example.com",
        name: "User",
        password: hashedPassword,
      }
    });
  });

  afterAll(async () => {
    await prismaClient.users.deleteMany();
    await prismaClient.$disconnect()
  });

  it("should return status code 200 when user is authenticated", async () => {
    const response = await request(app)
      .post("/entrar")
      .send({
        email: "user@example.com",
        password: "password"
      })
      .expect(200);

    expect(response.body).toHaveProperty("user");
    expect(response.body).toHaveProperty("token");
  });
});