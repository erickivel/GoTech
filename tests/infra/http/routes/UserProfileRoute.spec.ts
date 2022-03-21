import request from 'supertest';

import { prismaClient } from '../../../../src/infra/database/prisma/PrismaClient';
import { BcryptEncoder } from "../../../../src/infra/encoder/BcryptEncoder";
import { app } from '../../../../src/infra/http/app';

describe("User Profile Route", () => {
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

  it("should return status code 200 and body with user data if user is authenticated", async () => {
    const signInResponse = await request(app)
      .post("/sessions")
      .send({
        email: "user@example.com",
        password: "password"
      });

    const { token } = signInResponse.body;

    const response = await request(app)
      .get("/users/profile")
      .set({
        Authorization: `Bearer ${token}`
      })
      .expect(200);

    const expectedResponse = {
      id: "fake id",
      name: "User",
      email: "user@example.com"
    }

    expect(response.body).toEqual(expectedResponse);
  });


  it("should return status code 401 and body with unauthorized message if token is invalid", async () => {
    const response = await request(app)
      .get("/users/profile")
      .set({
        Authorization: `Bearer invalid-token`
      })
      .expect(401);

    expect(response.body).toEqual("Token is invalid!");
  });

  it("should return status code 401 and body with unauthorized message if token is missing", async () => {
    const response = await request(app)
      .get("/users/profile")
      .expect(401);

    expect(response.body).toEqual("Token is missing!");
  });
});