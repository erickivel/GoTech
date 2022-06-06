import request from 'supertest';

import { prismaClient } from '../../../../../src/infra/database/prisma/PrismaClient';
import { BcryptEncoder } from "../../../../../src/infra/encoder/BcryptEncoder";
import { app } from '../../../../../src/infra/http/app';

describe("Update User Route", () => {
  let hashedPassword: string;
  let dateNow: Date;

  beforeAll(async () => {
    const bcryptEncoder = new BcryptEncoder();

    hashedPassword = await bcryptEncoder.encode("password");

    dateNow = new Date();

    await prismaClient.$connect();

    await prismaClient.users.create({
      data: {
        id: "fake-id",
        email: "user@example.com",
        name: "User",
        password: hashedPassword,
        isAdmin: false,
        createdAt: dateNow,
        updatedAt: dateNow,
      }
    });
  });

  afterAll(async () => {
    await prismaClient.users.deleteMany();
    await prismaClient.$disconnect()
  });

  it("should return status code 201 and body with updated user data if user is authenticated", async () => {
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
        userid: "fake-id"
      })
      .expect(201);

    const expectedResponse = {
      id: "fake-id",
      name: "New Name",
      email: "newuser@example.com"
    }

    expect(response.body).toEqual(expectedResponse);
  });
});