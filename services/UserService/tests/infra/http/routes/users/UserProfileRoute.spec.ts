import request from 'supertest';

import { prismaClient } from '../../../../../src/infra/database/prisma/PrismaClient';
import { BcryptEncoder } from "../../../../../src/infra/encoder/BcryptEncoder";
import { app } from '../../../../../src/infra/http/app';

describe("User Profile Route", () => {
  beforeAll(async () => {
    const bcryptEncoder = new BcryptEncoder();

    const hashedPassword = await bcryptEncoder.encode("password");

    await prismaClient.$connect();
    await prismaClient.users.create({
      data: {
        id: "fake-id",
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

  it("should return status code 200 and body with user data if user is authenticated", async () => {
    const response = await request(app)
      .get("/users/profile")
      .set({
        userid: "fake-id"
      })
      .expect(200);

    const expectedResponse = {
      id: "fake-id",
      name: "User",
      email: "user@example.com"
    }

    expect(response.body).toEqual(expectedResponse);
  });
});