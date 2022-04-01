import request from 'supertest';

import { prismaClient } from '../../../../../src/infra/database/prisma/PrismaClient';
import { BcryptEncoder } from "../../../../../src/infra/encoder/BcryptEncoder";
import { app } from '../../../../../src/infra/http/app';

describe("Admin Update User Route", () => {
  let hashedPassword: string;
  let dateNow: Date;

  beforeAll(async () => {
    const bcryptEncoder = new BcryptEncoder();

    hashedPassword = await bcryptEncoder.encode("password");

    dateNow = new Date();

    await prismaClient.$connect();
    await prismaClient.users.create({
      data: {
        id: "admin-id",
        email: "admin@example.com",
        name: "Admin",
        password: hashedPassword,
        isAdmin: true,
        createdAt: dateNow,
        updatedAt: dateNow,
      }
    });

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

  it("should return status code 201 and body with user updated if user is authenticated and is an admin", async () => {
    const signInResponse = await request(app)
      .post("/sessions")
      .send({
        email: "admin@example.com",
        password: "password"
      });

    const { token } = signInResponse.body;

    const response = await request(app)
      .put("/users/admin/update")
      .send({
        user_id_to_be_updated: "fake-id",
        name: "New Name",
        email: "new-email@example.com",
      })
      .set({
        Authorization: `Bearer ${token}`
      })
      .expect(201);

    const expectedResponse = {
      id: "fake-id",
      email: "new-email@example.com",
      name: "New Name",
    };

    expect(response.body).toEqual(expectedResponse);
  });
});