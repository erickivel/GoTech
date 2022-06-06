import { Context } from "aws-lambda";
import { prismaClient } from "../../../src/infra/database/prisma/PrismaClient";
import { handle } from "../../../src/infra/serverless/functions/PlaceOrder";

describe("Place Order Serverless Function", () => {
  beforeAll(async () => {
    await prismaClient.$connect();
  });

  afterAll(async () => {
    await prismaClient.productAmount.deleteMany();
    await prismaClient.products.deleteMany();
    await prismaClient.orders.deleteMany();
    await prismaClient.users.deleteMany();
    await prismaClient.$disconnect();
  });

  it("should return status code 201 and the created order", async () => {
    const event = {
      requestContext: {
        authorizer: {
          user: {
            id: "user-id",
            name: "User Name",
            email: "user@example.com"
          },
        },
      },
      body: {
        products: [
          {
            id: "product-id-1",
            name: "Product 1",
            price: 254.59,
            amount: 1
          },
          {
            id: "product-id-2",
            name: "Product 2",
            price: 129.42,
            amount: 3
          }
        ]
      }
    };
    const context = {} as Context;

    const placeOrderServerless = await handle(event, context);

    const bodyParsed = JSON.parse(placeOrderServerless.body);

    expect(bodyParsed).toHaveProperty("id");
    expect(bodyParsed).toHaveProperty("user");
    expect(bodyParsed.user.id).toEqual("user-id");
    expect(bodyParsed).toHaveProperty("products");
    expect(bodyParsed).toHaveProperty("total");
    expect(placeOrderServerless.statusCode).toEqual(201);
  });
});