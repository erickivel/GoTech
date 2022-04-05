import { Order } from "../../src/domain/entities/Order";
import { InvalidOrderTotalError } from "../../src/domain/entities/Order/errors/InvalidOrderTotalError";

describe("Order Validator", () => {
  it("should create an order", () => {
    const order = {
      user: {
        id: "user-id",
        name: "User Name",
        email: "user@example.com"
      },
      products: [
        {
          id: "product-id",
          name: "Product  Name",
          price: 100.42,
          amount: 3
        }
      ],
      total: 100.42
    };

    const createdOrderOrError = Order.create(order);

    const dateNow = new Date();

    const orderWithAllParams = {
      id: "order-id",
      user: {
        id: "user-id",
        name: "User Name",
        email: "user@example.com"
      },
      products: [
        {
          id: "product-id",
          name: "Product  Name",
          price: 100.42,
          amount: 3
        }
      ],
      total: 100.42,
      createdAt: dateNow,
      updatedAt: dateNow,
    };

    const createdOrderWithAllParamsOrError = Order.create(orderWithAllParams);

    expect(createdOrderOrError.isRight()).toBeTruthy();
    expect(createdOrderOrError.value).toMatchObject(order);
    expect(createdOrderWithAllParamsOrError.isRight()).toBeTruthy();
    expect(createdOrderWithAllParamsOrError.value).toEqual(orderWithAllParams);
  });

  it("should not create an order if total is invalid", () => {
    const invalidTotal = 42.076;

    const invalidTotalOrder = {
      user: {
        id: "user-id",
        name: "User Name",
        email: "user@example.com"
      },
      products: [
        {
          id: "product-id",
          name: "Product  Name",
          price: 100.42,
          amount: 3
        }
      ],
      total: invalidTotal
    };

    const createdInvalidTotalOrderOrError = Order.create(invalidTotalOrder);

    const negativeTotal = -42;

    const negativeTotalOrder = {
      user: {
        id: "user-id",
        name: "User Name",
        email: "user@example.com"
      },
      products: [
        {
          id: "product-id",
          name: "Product  Name",
          price: 100.42,
          amount: 3
        }
      ],
      total: negativeTotal
    };

    const createdNegativeTotalOrderOrError = Order.create(negativeTotalOrder);

    expect(createdInvalidTotalOrderOrError.isLeft()).toBeTruthy();
    expect(createdInvalidTotalOrderOrError.value).toEqual(new InvalidOrderTotalError(invalidTotal));
    expect(createdNegativeTotalOrderOrError.isLeft()).toBeTruthy();
    expect(createdNegativeTotalOrderOrError.value).toEqual(new InvalidOrderTotalError(negativeTotal));
  });
});
