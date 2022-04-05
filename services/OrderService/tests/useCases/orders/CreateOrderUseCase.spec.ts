import { InvalidOrderTotalError } from "../../../src/domain/entities/Order/errors/InvalidOrderTotalError";
import { CreateOrderUseCase } from "../../../src/useCases/orders/CreateOrderUseCase";
import { OrdersRepositoryInMemory } from "../../doubles/repositories/OrdersRepositoryInMemory";

describe("Create Order UseCase", () => {
  let ordersRepositoryInMemory: OrdersRepositoryInMemory;
  let createOrderUseCase: CreateOrderUseCase;

  beforeEach(() => {
    ordersRepositoryInMemory = new OrdersRepositoryInMemory();
    createOrderUseCase = new CreateOrderUseCase(ordersRepositoryInMemory);
  });

  it("should create an order", async () => {
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

    const orderOrError = await createOrderUseCase.execute(order);

    console.log(orderOrError.value);

    expect(orderOrError.isRight).toBeTruthy();
    expect(orderOrError.value).toHaveProperty("id");
    expect(orderOrError.value).toHaveProperty("user");
    expect(orderOrError.value).toHaveProperty("products");
    expect(orderOrError.value).toHaveProperty("total");
    if (orderOrError.isRight()) {
      expect(orderOrError.value.total).toEqual(642.85); // 254.59 + (129.42 * 3)
    };
  });

  it("should not create an order if total is invalid", async () => {
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

    const orderOrError = await createOrderUseCase.execute(order);

    console.log(orderOrError.value);

    expect(orderOrError.isRight).toBeTruthy();
    expect(orderOrError.value).toEqual(new InvalidOrderTotalError(267.048)); // 254.59 + 12.458
  });
});