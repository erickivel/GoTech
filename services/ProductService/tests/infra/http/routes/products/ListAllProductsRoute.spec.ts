import request from 'supertest';

import { prismaClient } from '../../../../../src/infra/database/prisma/PrismaClient';
import { app } from '../../../../../src/infra/http/app';

describe("List All Products Route", () => {
  let dateNow: Date;

  beforeAll(async () => {
    dateNow = new Date();

    await prismaClient.$connect();
    const category = await prismaClient.categories.create({
      data: {
        id: "category-id",
        name: "Category-1",
        createdAt: dateNow,
        updatedAt: dateNow,
      }
    });

    await prismaClient.products.create({
      data: {
        id: "fake-id-1",
        name: "Product 1",
        price: 120.13,
        stock: 1254,
        categoryId: category.id,
        createdAt: dateNow,
        updatedAt: dateNow,
      }
    });

    await prismaClient.products.create({
      data: {
        id: "fake-id-2",
        name: "Product 2",
        price: 120.13,
        stock: 1254,
        categoryId: category.id,
        createdAt: dateNow,
        updatedAt: dateNow,
      }
    });
  });

  afterAll(async () => {
    await prismaClient.categories.deleteMany();
    await prismaClient.products.deleteMany();
    await prismaClient.$disconnect()
  });

  it("should return status code 200 and all the products", async () => {
    const response = await request(app)
      .get("/")
      .expect(200);

    const bodyExpectedResponse = [
      {
        id: "fake-id-1",
        name: "Product 1",
        price: 120.13,
        stock: 1254,
        categoryId: "category-id",
        createdAt: dateNow.toISOString(),
        updatedAt: dateNow.toISOString(),
        category: {
          id: "category-id",
          name: "Category-1",
          createdAt: dateNow.toISOString(),
          updatedAt: dateNow.toISOString(),
        }
      },
      {
        id: "fake-id-2",
        name: "Product 2",
        price: 120.13,
        stock: 1254,
        categoryId: "category-id",
        createdAt: dateNow.toISOString(),
        updatedAt: dateNow.toISOString(),
        category: {
          id: "category-id",
          name: "Category-1",
          createdAt: dateNow.toISOString(),
          updatedAt: dateNow.toISOString(),
        }
      }
    ];

    expect(response.body).toEqual(bodyExpectedResponse);
  });
});