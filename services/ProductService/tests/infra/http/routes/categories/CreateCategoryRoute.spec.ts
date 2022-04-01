import request from 'supertest';

import { prismaClient } from '../../../../../src/infra/database/prisma/PrismaClient';
import { BcryptEncoder } from '../../../../../src/infra/encoder/BcryptEncoder';
import { app } from '../../../../../src/infra/http/app';



describe("Create Category Route", () => {
  beforeAll(async () => {
    const bcryptEncoder = new BcryptEncoder();

    const hashedPassword = await bcryptEncoder.encode("password");

    const dateNow = new Date();

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
  });

  afterAll(async () => {
    await prismaClient.categories.deleteMany();
    await prismaClient.users.deleteMany();
    await prismaClient.$disconnect()
  });

  it("should return status code 201 when category is created", async () => {
    const signInResponse = await request(app)
      .post("/sessions")
      .send({
        email: "admin@example.com",
        password: "password"
      });

    const { token } = signInResponse.body;

    const response = await request(app)
      .post("/categories")
      .send({
        name: "Headphones",
      })
      .set({
        Authorization: `Bearer ${token}`
      })
      .expect(201);

    const createdCategory = await prismaClient.categories.findMany();

    expect(createdCategory[0]).toHaveProperty("id");
    expect(createdCategory[0].name).toEqual("Headphones");
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name");
    expect(response.body.name).toEqual("Headphones");
    expect(response.body).toHaveProperty("createdAt");
  });
});