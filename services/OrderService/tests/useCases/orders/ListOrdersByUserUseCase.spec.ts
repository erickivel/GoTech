import { ListOrdersByUserUseCase } from "../../../src/useCases/orders/ListOrdersByUserUseCase";
import { OrdersRepositoryInMemory } from "../../doubles/repositories/OrdersRepositoryInMemory";

describe("List Orders By User UseCase", () => {
  let ordersRepositoryInMemory: OrdersRepositoryInMemory;
  let listOrdersByUserUseCase: ListOrdersByUserUseCase;

  beforeEach(() => {
    ordersRepositoryInMemory = new OrdersRepositoryInMemory();
    listOrdersByUserUseCase = new ListOrdersByUserUseCase(ordersRepositoryInMemory);
  });

  it("should list all user's orders", async () => {
    const dateNow = new Date();

    ordersRepositoryInMemory.create({
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

    ordersRepositoryInMemory.create({
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

    const orders = await listOrdersByUserUseCase.execute({ userId: "user-id" });

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

    expect(orders.isRight).toBeTruthy();
    expect(orders.value).toEqual(expectedResponse);
  });
});