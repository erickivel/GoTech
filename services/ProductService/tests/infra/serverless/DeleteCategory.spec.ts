import { prismaClient } from "../../../src/infra/database/prisma/PrismaClient";
import { handle } from "../../../src/infra/serverless/functions/DeleteCategory";

describe("Delete Category Serverless Function", () => {
  let dateNow: Date;

  beforeAll(async () => {
    dateNow = new Date();

    await prismaClient.$connect();
    await prismaClient.categories.create({
      data: {
        id: "category-id-1",
        name: "Category 1",
        createdAt: dateNow,
        updatedAt: dateNow,
      }
    });

    await prismaClient.categories.create({
      data: {
        id: "category-id-2",
        name: "Category 2",
        createdAt: dateNow,
        updatedAt: dateNow,
      }
    });
  });

  afterAll(async () => {
    await prismaClient.categories.deleteMany();
    await prismaClient.$disconnect();
  });

  it("should return status code 200 if the category is deleted", async () => {
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
        id: "category-id-1"
      }
    };
    const context = {};

    const deleteCategoryServerless = await handle(event, context);

    const categories = await prismaClient.categories.findMany();

    const expectedResponse = [
      {
        id: "category-id-2",
        name: "Category 2",
        createdAt: dateNow,
        updatedAt: dateNow,
      }
    ]

    expect(categories).toEqual(expectedResponse);
    expect(deleteCategoryServerless.statusCode).toEqual(200);
  });
});