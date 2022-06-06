import { container } from "tsyringe";

import { PlaceOrderController } from "../../src/controllers/orders/PlaceOrderController";
import { IMessagingAdapter } from "../../src/useCases/orders/ports/IMessagingAdapter";
import { IOrdersRepository } from "../../src/useCases/orders/ports/IOrdersRepository";
import { FakeMessagingAdapter } from "../doubles/FakeMessagingAdapter";
import { OrdersRepositoryInMemory } from "../doubles/repositories/OrdersRepositoryInMemory";

describe("Place Order Controller", () => {
  let placeOrderController: PlaceOrderController;

  beforeEach(() => {
    container.registerSingleton<IOrdersRepository>("OrdersRepository", OrdersRepositoryInMemory);
    container.registerSingleton<IMessagingAdapter>("MessagingAdapter", FakeMessagingAdapter);
    placeOrderController = new PlaceOrderController();
  });

  afterAll(() => {
    container.clearInstances();
  });

  it("should return status code 201 and body with the created order", async () => {
    const fakeRequest = {
      requestContext: {
        authorizer: {
          user: {
            id: "admin-id",
            name: "user name",
            email: "user email"
          }
        }
      },
      body: {
        products: [
          {
            id: "product-id",
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
        ],
      },
    };

    const result = await placeOrderController.handle(fakeRequest);

    expect(result.body).toHaveProperty("id");
    expect(result.body).toHaveProperty("user");
    expect(result.body).toHaveProperty("products");
    expect(result.body).toHaveProperty("total");
    expect(result.statusCode).toBe(201);
  });

  it("should return status code 401 if user is missing", async () => {
    const fakeRequest = {
      requestContext: {
        authorizer: {
        }
      },
      body: {
        products: [
          {
            id: "product-id",
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
        ],
      },
    };

    const result = await placeOrderController.handle(fakeRequest);

    expect(result.body).toEqual("User is not authenticated!")
    expect(result.statusCode).toBe(401);
  });

  it("should return status code 400 if products are missing", async () => {
    const fakeRequest = {
      requestContext: {
        authorizer: {
          user: {
            id: "admin-id",
            name: "user name",
            email: "user email"
          }
        }
      },
      body: {
      },
    };

    const result = await placeOrderController.handle(fakeRequest);

    expect(result.body).toEqual("Missing parameter(s): products.");
    expect(result.statusCode).toBe(400);
  });
});