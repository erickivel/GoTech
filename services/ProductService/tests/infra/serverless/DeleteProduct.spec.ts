import { prismaClient } from "../../../src/infra/database/prisma/PrismaClient";
import { handle } from "../../../src/infra/serverless/functions/DeleteProduct";

describe("Delete Product Serverless Function", () => {
  let dateNow: Date;

  beforeAll(async () => {
    dateNow = new Date();

    await prismaClient.$connect();
    await prismaClient.categories.create({
      data: {
        id: "category-id",
        name: "Category",
        createdAt: dateNow,
        updatedAt: dateNow,
      }
    });

    await prismaClient.products.create({
      data: {
        id: "product-id-1",
        name: "Product 1",
        price: 120.13,
        stock: 10,
        categoryId: "category-id",
        createdAt: dateNow,
        updatedAt: dateNow,
      }
    });

    await prismaClient.products.create({
      data: {
        id: "product-id-2",
        name: "Product 2",
        price: 120.13,
        stock: 10,
        categoryId: "category-id",
        createdAt: dateNow,
        updatedAt: dateNow,
      }
    });
  });

  afterAll(async () => {
    await prismaClient.categories.deleteMany();
    await prismaClient.products.deleteMany();
    await prismaClient.$disconnect();
  });

  it("should return status code 200 if the product is deleted", async () => {
    const event = {
      requestContext: {
        authorizer: {
          user: {
            id: "admin-id",
            name: "Admin",
            email: "admin@example.com"
          },
        },
      },
      pathParameters: {
        id: "product-id-1",
      }
    };
    const context = {};

    const deleteProductServerless = await handle(event, context);

    const products = await prismaClient.products.findMany();

    const expectedResponse = [
      {
        id: "product-id-2",
        name: "Product 2",
        price: {},
        stock: 10,
        categoryId: "category-id",
        createdAt: dateNow,
        updatedAt: dateNow,
      }
    ]

    expect(products).toMatchObject(expectedResponse);
    expect(deleteProductServerless.statusCode).toEqual(200);
  });
});