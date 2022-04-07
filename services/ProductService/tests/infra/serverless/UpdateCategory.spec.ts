import { prismaClient } from "../../../src/infra/database/prisma/PrismaClient";
import { handle } from "../../../src/infra/serverless/functions/UpdateCategory";

describe("Update Category Serverless Function", () => {
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
    await prismaClient.categories.deleteMany();
    await prismaClient.$disconnect();
  });

  it("should return status code 201 and the updated category", async () => {
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
        name: "New Name"
      },
      pathParameters: {
        id: "category-id"
      }
    };
    const context = {};

    const deleteCategoryServerless = await handle(event, context);

    const bodyParsed = JSON.parse(deleteCategoryServerless.body);

    const categories = await prismaClient.categories.findFirst({
      where: {
        id: "category-id"
      }
    });

    const expectedResponse = {
      id: "category-id",
      name: "New Name",
      createdAt: dateNow,
    };

    expect(categories).toMatchObject(expectedResponse);
    expect(bodyParsed).toHaveProperty("id");
    expect(bodyParsed).toHaveProperty("name");
    expect(bodyParsed.name).toEqual("New Name");
    expect(deleteCategoryServerless.statusCode).toEqual(201);
  });
});