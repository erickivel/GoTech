import { prismaClient } from "../../../src/infra/database/prisma/PrismaClient";
import { handle } from "../../../src/infra/serverless/functions/CreateCategory";

describe("Create Category Serverless Function", () => {
  beforeAll(async () => {
    await prismaClient.$connect();
  });

  afterAll(async () => {
    await prismaClient.categories.deleteMany();
    await prismaClient.$disconnect();
  });

  it("should return status code 201 and the created category", async () => {
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
        name: "Category Name"
      }
    };
    const context = {};

    const createCategoryServerless = await handle(event, context);

    const bodyParsed = JSON.parse(createCategoryServerless.body);

    expect(bodyParsed).toHaveProperty("id");
    expect(bodyParsed).toHaveProperty("name");
    expect(bodyParsed.name).toEqual("Category Name");
    expect(createCategoryServerless.statusCode).toEqual(201);
  });
});