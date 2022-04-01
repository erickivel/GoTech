import request from 'supertest';

import { prismaClient } from '../../../../../src/infra/database/prisma/PrismaClient';
import { app } from '../../../../../src/infra/http/app';



describe("Create User Route", () => {
  beforeAll(async () => {
    await prismaClient.$connect();
  });

  afterAll(async () => {
    await prismaClient.users.deleteMany();
    await prismaClient.$disconnect()
  });

  it("should return status code 201 when user is created", async () => {
    const response = await request(app)
      .post("/users")
      .send({
        name: "User",
        email: "user@example.com",
        password: "password"
      })
      .expect(201);

    const createdUser = await prismaClient.users.findMany();

    expect(createdUser[0]).toHaveProperty("id")
    expect(createdUser[0].email).toEqual("user@example.com")
    expect(createdUser[0].password).not.toEqual("password")
    expect(response.body).toEqual("User Created!");
  });
});