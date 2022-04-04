import request from 'supertest';

import { prismaClient } from '../../../../../src/infra/database/prisma/PrismaClient';
import { BcryptEncoder } from "../../../../../src/infra/encoder/BcryptEncoder";
import { app } from '../../../../../src/infra/http/app';

describe("List All Users Profile Route", () => {
  let hashedPassword: string;
  let dateNow: Date;

  beforeAll(async () => {
    const bcryptEncoder = new BcryptEncoder();

    hashedPassword = await bcryptEncoder.encode("password");

    dateNow = new Date();

    await prismaClient.$connect();
  });

  afterAll(async () => {
    await prismaClient.users.deleteMany();
    await prismaClient.$disconnect()
  });

  it("should return status code 200 and body with all users if user is authenticated and is an admin", async () => {
    const response = await request(app)
      .get("/users")
      .expect(200);

    const expectedResponse = [
      {
        id: "fake id",
        email: "admin@example.com",
        name: "Admin",
        createdAt: dateNow.toISOString(),
        updatedAt: dateNow.toISOString(),
      }
    ]

    expect(response.body).toEqual(expectedResponse);
  });

  it("should return status code 401 and body with unauthorized message if token is invalid", async () => {
    const response = await request(app)
      .get("/users")
      .set({
        Authorization: `Bearer invalid-token`
      })
      .expect(401);

    expect(response.body).toEqual("Token is invalid!");
  });

  it("should return status code 401 and body with unauthorized message if token is missing", async () => {
    const response = await request(app)
      .get("/users")
      .expect(401);

    expect(response.body).toEqual("Token is missing!");
  });
});