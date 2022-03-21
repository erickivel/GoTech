import request from 'supertest';

import { prismaClient } from '../../../../src/infra/database/prisma/PrismaClient';
import { BcryptEncoder } from "../../../../src/infra/encoder/BcryptEncoder";
import { app } from '../../../../src/infra/http/app';

describe("Update User Route", () => {
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

  it("should return status code 201 and body with updated user data if user is authenticated", async () => {
    const signInResponse = await request(app)
      .post("/sessions")
      .send({
        email: "user@example.com",
        password: "password"
      });

    const { token } = signInResponse.body;

    const response = await request(app)
      .put("/users/update")
      .send({
        name: "New Name",
        email: "newuser@example.com",
        old_password: "password",
        new_password: "newPassword",
        confirm_password: "newPassword",
      })
      .set({
        Authorization: `Bearer ${token}`
      })
      .expect(201);

    const expectedResponse = {
      id: "fake id",
      name: "New Name",
      email: "newuser@example.com"
    }

    expect(response.body).toEqual(expectedResponse);
  });
});