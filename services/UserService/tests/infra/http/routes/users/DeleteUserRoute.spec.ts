import request from 'supertest';

import { prismaClient } from '../../../../../src/infra/database/prisma/PrismaClient';
import { BcryptEncoder } from "../../../../../src/infra/encoder/BcryptEncoder";
import { app } from '../../../../../src/infra/http/app';

describe("Delete User Route", () => {
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
        id: "fake-id-2",
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

  it("should return status code 200 and body with all users if user is authenticated and is an admin", async () => {
    const response = await request(app)
      .delete("/users/fake-id-2")
      .set({
        userid: "admin-id"
      })
      .expect(200);

    const allUsersResponse = await request(app)
      .get("/users")
      .set({
        userid: "admin-id"
      })

    const expectedResponse = [
      {
        id: "admin-id",
        email: "admin@example.com",
        name: "Admin",
        createdAt: dateNow.toISOString(),
        updatedAt: dateNow.toISOString(),
      }
    ]

    expect(response.body).toEqual("User deleted!");
    expect(allUsersResponse.body).toEqual(expectedResponse);
  });
});