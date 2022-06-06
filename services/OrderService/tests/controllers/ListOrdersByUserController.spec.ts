import { container } from "tsyringe";
import { ListOrdersByUserController } from "../../src/controllers/orders/ListOrdersByUserController";

import { IOrdersRepository } from "../../src/useCases/orders/ports/IOrdersRepository";
import { OrdersActions } from "../doubles/OrdersActions";
import { OrdersRepositoryInMemory } from "../doubles/repositories/OrdersRepositoryInMemory";

describe("List Orders By User Controller", () => {
  let listOrdersByUserController: ListOrdersByUserController;

  beforeEach(() => {
    container.registerSingleton<IOrdersRepository>("OrdersRepository", OrdersRepositoryInMemory);
    listOrdersByUserController = new ListOrdersByUserController();
  });

  afterAll(() => {
    container.clearInstances();
  });

  it("should return status code 200 and body with all user's orders", async () => {
    const ordersActions = container.resolve(OrdersActions);

    const dateNow = new Date();

    await ordersActions.create({
      id: "order-id",
      user: {
        id: "another-user-id",
        name: "User Name",
        email: "user@example.com"
      },
      products: [
        {
          id: "product-id",
          name: "Product 1",
          price: 254.59,
          amount: 1
        }
      ],
      total: 254.59,
      createdAt: dateNow,
      updatedAt: dateNow,
    });

    await ordersActions.create({
      id: "order-id",
      user: {
        id: "user-id",
        name: "User Name",
        email: "user@example.com"
      },
      products: [
        {
          id: "product-id-2",
          name: "Product 2",
          price: 129.42,
          amount: 3
        }
      ],
      total: 388.26,
      createdAt: dateNow,
      updatedAt: dateNow,
    });

    const fakeRequest = {
      requestContext: {
        authorizer: {
          user: {
            id: "user-id",
            name: "User name",
            email: "user@example.com"
          }
        }
      },
    };

    const result = await listOrdersByUserController.handle(fakeRequest);

    const expectedResponse = [
      {
        id: "order-id",
        user: {
          id: "user-id",
          name: "User Name",
          email: "user@example.com"
        },
        products: [
          {
            id: "product-id-2",
            name: "Product 2",
            price: 129.42,
            amount: 3
          }
        ],
        total: 388.26,
        createdAt: dateNow,
        updatedAt: dateNow,
      }
    ];

    expect(result.body).toEqual(expectedResponse);
    expect(result.statusCode).toBe(200);
  });

  it("should return status code 401 if user id is missing", async () => {
    const ordersActions = container.resolve(OrdersActions);

    const dateNow = new Date();

    await ordersActions.create({
      id: "order-id",
      user: {
        id: "user-id",
        name: "User Name",
        email: "user@example.com"
      },
      products: [
        {
          id: "product-id-2",
          name: "Product 2",
          price: 129.42,
          amount: 3
        }
      ],
      total: 388.26,
      createdAt: dateNow,
      updatedAt: dateNow,
    });

    const fakeRequest = {
      requestContext: {
        authorizer: {
        }
      },
    };

    const result = await listOrdersByUserController.handle(fakeRequest);

    expect(result.body).toEqual("User is not authenticated!");
    expect(result.statusCode).toBe(401);
  });
});