import request from 'supertest';

import { prismaClient } from '../../../../../src/infra/database/prisma/PrismaClient';
import { BcryptEncoder } from '../../../../../src/infra/encoder/BcryptEncoder';
import { app } from '../../../../../src/infra/http/app';

describe("Delete Category Route", () => {
  let dateNow: Date;

  beforeAll(async () => {
    const bcryptEncoder = new BcryptEncoder();

    const hashedPassword = await bcryptEncoder.encode("password");

    dateNow = new Date();

    await prismaClient.$connect();
    await prismaClient.users.create({
      data: {
        id: "fake id",
        email: "admin@example.com",
        name: "Admin",
        password: hashedPassword,
        isAdmin: true,
        createdAt: dateNow,
        updatedAt: dateNow,
      }
    });

    await prismaClient.categories.create({
      data: {
        id: "fake-id-1",
        name: "Category 1",
        createdAt: dateNow,
        updatedAt: dateNow,
      }
    });

    await prismaClient.categories.create({
      data: {
        id: "fake-id-2",
        name: "Category 2",
        createdAt: dateNow,
        updatedAt: dateNow,
      }
    });
  });

  afterAll(async () => {
    await prismaClient.categories.deleteMany();
    await prismaClient.users.deleteMany();
    await prismaClient.$disconnect()
  });

  it("should return status code 200 and a successful message when the user is deleted", async () => {
    const signInResponse = await request(app)
      .post("/sessions")
      .send({
        email: "admin@example.com",
        password: "password"
      });

    const { token } = signInResponse.body;

    const response = await request(app)
      .delete("/categories/delete/fake-id-1")
      .set({
        Authorization: `Bearer ${token}`
      })
      .expect(200);

    const categories = await prismaClient.categories.findMany();

    const repositoryExpectedResponse = [
      {
        id: "fake-id-2",
        name: "Category 2",
        createdAt: dateNow,
        updatedAt: dateNow,
      }
    ];

    expect(categories).toEqual(repositoryExpectedResponse);
    expect(response.body).toEqual("Category deleted successfully!");
  });
});