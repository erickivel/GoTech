import { InvalidOrderTotalError } from "../../../src/domain/entities/Order/errors/InvalidOrderTotalError";
import { PlaceOrderUseCase } from "../../../src/useCases/orders/PlaceOrderUseCase";
import { OrdersRepositoryInMemory } from "../../doubles/repositories/OrdersRepositoryInMemory";

describe("Place Order UseCase", () => {
  let ordersRepositoryInMemory: OrdersRepositoryInMemory;
  let placeOrderUseCase: PlaceOrderUseCase;

  beforeEach(() => {
    ordersRepositoryInMemory = new OrdersRepositoryInMemory();
    placeOrderUseCase = new PlaceOrderUseCase(ordersRepositoryInMemory);
  });

  it("should place an order", async () => {
    const order = {
      user: {
        id: "user-id",
        name: "User Name",
        email: "user@example.com"
      },
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
    };

    const orderOrError = await placeOrderUseCase.execute(order);

    expect(orderOrError.isRight).toBeTruthy();
    expect(orderOrError.value).toHaveProperty("id");
    expect(orderOrError.value).toHaveProperty("user");
    expect(orderOrError.value).toHaveProperty("products");
    expect(orderOrError.value).toHaveProperty("total");
    if (orderOrError.isRight()) {
      expect(orderOrError.value.total).toEqual(642.85); // 254.59 + (129.42 * 3)
    };
  });

  it("should not place an order if total is invalid", async () => {
    const invalidPrice = 12.458;

    const order = {
      user: {
        id: "user-id",
        name: "User Name",
        email: "user@example.com"
      },
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
          price: invalidPrice,
          amount: 1
        }
      ],
    };

    const orderOrError = await placeOrderUseCase.execute(order);

    expect(orderOrError.isRight).toBeTruthy();
    expect(orderOrError.value).toEqual(new InvalidOrderTotalError(267.048)); // 254.59 + 12.458
  });
});