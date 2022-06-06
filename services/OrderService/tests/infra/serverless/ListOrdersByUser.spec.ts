import { Context } from "aws-lambda";

import { prismaClient } from "../../../src/infra/database/prisma/PrismaClient";
import { handle as PlaceOrder } from "../../../src/infra/serverless/functions/PlaceOrder";
import { handle as ListOrdersByUser } from "../../../src/infra/serverless/functions/ListOrdersByUser";

describe("List Orders By User Serverless Function", () => {
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

  it("should return status code 200 and the user's orders", async () => {
    const placeOrderEvent = {
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
        ]
      }
    };
    const context = {} as Context;

    await PlaceOrder(placeOrderEvent, context);

    const listOrdersByUserEvent = {
      requestContext: {
        authorizer: {
          user: {
            id: "user-id",
            name: "User Name",
            email: "user@example.com"
          },
        },
      },
    };

    const listOrdersByUserServerless = await ListOrdersByUser(listOrdersByUserEvent, context);

    const bodyParsed = JSON.parse(listOrdersByUserServerless.body);

    expect(bodyParsed[0]).toHaveProperty("id");
    expect(bodyParsed[0]).toHaveProperty("user");
    expect(bodyParsed[0].user.id).toEqual("user-id");
    expect(bodyParsed[0]).toHaveProperty("products");
    expect(bodyParsed[0]).toHaveProperty("total");
    expect(listOrdersByUserServerless.statusCode).toEqual(200);
  });
});
