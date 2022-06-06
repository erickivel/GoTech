import request from 'supertest';

import { prismaClient } from '../../../../../src/infra/database/prisma/PrismaClient';
import { app } from '../../../../../src/infra/http/app';

describe("List All Categories Route", () => {
  let dateNow: Date;

  beforeAll(async () => {
    dateNow = new Date();

    await prismaClient.$connect();
    await prismaClient.categories.create({
      data: {
        id: "fake-id-1",
        name: "Category-1",
        createdAt: dateNow,
        updatedAt: dateNow,
      }
    });

    await prismaClient.categories.create({
      data: {
        id: "fake-id-2",
        name: "Category-2",
        createdAt: dateNow,
        updatedAt: dateNow,
      }
    });
  });

  afterAll(async () => {
    await prismaClient.categories.deleteMany();
    await prismaClient.$disconnect()
  });

  it("should return status code 200 and all the categories", async () => {
    const response = await request(app)
      .get("/categories")
      .expect(200);

    const createdCategory = await prismaClient.categories.findMany();

    const repositoryExpectedResponse = [
      {
        id: "fake-id-1",
        name: "Category-1",
        createdAt: dateNow,
        updatedAt: dateNow,
      },
      {
        id: "fake-id-2",
        name: "Category-2",
        createdAt: dateNow,
        updatedAt: dateNow,
      }
    ];

    const bodyExpectedResponse = [
      {
        id: "fake-id-1",
        name: "Category-1",
        createdAt: dateNow.toISOString(),
        updatedAt: dateNow.toISOString(),
      },
      {
        id: "fake-id-2",
        name: "Category-2",
        createdAt: dateNow.toISOString(),
        updatedAt: dateNow.toISOString(),
      }
    ];

    expect(createdCategory).toEqual(repositoryExpectedResponse);
    expect(response.body).toEqual(bodyExpectedResponse);
  });
});