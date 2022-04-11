import { prismaClient } from "../../../src/infra/database/prisma/PrismaClient";
import { handle as ReduceProductStock } from "../../../src/infra/serverless/functions/ReduceProductStock";

describe("Reduce Products Stock Serverless Function", () => {
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


  });

  afterAll(async () => {
    await prismaClient.products.deleteMany();
    await prismaClient.categories.deleteMany();
    await prismaClient.$disconnect();
  });

  it("should return status code 200 if products stock are reduced", async () => {
    await prismaClient.products.create({
      data: {
        id: "fake-id-1",
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
        id: "fake-id-2",
        name: "Product 2",
        price: 120.13,
        stock: 10,
        categoryId: "category-id",
        createdAt: dateNow,
        updatedAt: dateNow,
      }
    });

    const message = JSON.stringify({
      products: [
        {
          id: "fake-id-1",
          amount: 10,
        },
        {
          id: "fake-id-2",
          amount: 1,
        },
      ],
    });

    const event = {
      Records: [
        {
          body: message
        },
      ]
    };
    const context = {};

    const reduceProductsStockServerless = await ReduceProductStock(event, context);

    const bodyParsed = JSON.parse(reduceProductsStockServerless.body);

    expect(bodyParsed).toEqual("Products Stock Updated!");
    expect(reduceProductsStockServerless.statusCode).toEqual(200);
  });
});