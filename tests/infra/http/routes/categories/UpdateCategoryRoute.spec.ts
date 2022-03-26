import request from 'supertest';

import { prismaClient } from '../../../../../src/infra/database/prisma/PrismaClient';
import { BcryptEncoder } from '../../../../../src/infra/encoder/BcryptEncoder';
import { app } from '../../../../../src/infra/http/app';



describe("Update Category Route", () => {
  let date: Date;

  beforeAll(async () => {
    const bcryptEncoder = new BcryptEncoder();

    const hashedPassword = await bcryptEncoder.encode("password");

    date = new Date("8-25-2020");

    await prismaClient.$connect();
    await prismaClient.users.create({
      data: {
        id: "fake id",
        email: "admin@example.com",
        name: "Admin",
        password: hashedPassword,
        isAdmin: true,
        createdAt: date,
        updatedAt: date,
      }
    });

    await prismaClient.categories.create({
      data: {
        id: "fake-id",
        name: "Category Name",
        createdAt: date,
        updatedAt: date,
      }
    });
  });

  afterAll(async () => {
    await prismaClient.categories.deleteMany();
    await prismaClient.users.deleteMany();
    await prismaClient.$disconnect()
  });

  it("should return status code 201 and the category when category is updated", async () => {
    const signInResponse = await request(app)
      .post("/sessions")
      .send({
        email: "admin@example.com",
        password: "password"
      });

    const { token } = signInResponse.body;

    const response = await request(app)
      .put("/categories/update/fake-id")
      .send({
        name: "New Category Name",
      })
      .set({
        Authorization: `Bearer ${token}`
      })
      .expect(201);

    const categories = await prismaClient.categories.findMany();

    const repositoryExpectedResponse = {
      id: "fake-id",
      name: "New Category Name",
      createdAt: date,
    };

    const bodyExpectedResponse = {
      id: "fake-id",
      name: "New Category Name",
      createdAt: date.toISOString(),
    };

    expect(categories[0]).toMatchObject(repositoryExpectedResponse);
    expect(categories[0].updatedAt).not.toEqual(date);
    expect(response.body).toMatchObject(bodyExpectedResponse);
    expect(response.body.updatedAt).not.toEqual(date);
  });
});