import { prismaClient } from "../../../src/infra/database/prisma/PrismaClient";
import { handle } from "../../../src/infra/serverless/functions/CreateProduct";

describe("Create Product Serverless Function", () => {
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

  it("should return status code 201 and the created product", async () => {
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
      body: {
        name: "Product Name",
        stock: 42,
        price: 25.45,
        categoryId: "category-id"
      }
    };
    const context = {};

    const createProductServerless = await handle(event, context);

    const bodyParsed = JSON.parse(createProductServerless.body);

    expect(bodyParsed).toHaveProperty("id");
    expect(bodyParsed).toHaveProperty("name");
    expect(bodyParsed.name).toEqual("Product Name");
    expect(bodyParsed).toHaveProperty("stock");
    expect(bodyParsed).toHaveProperty("price");
    expect(bodyParsed).toHaveProperty("categoryId");
    expect(createProductServerless.statusCode).toEqual(201);
  });
});