import { IOrderData } from "../../../../useCases/orders/ports/IOrderData";
import { IOrdersRepository } from "../../../../useCases/orders/ports/IOrdersRepository";
import { prismaClient } from "../PrismaClient";

export class PrismaOrdersRepository implements IOrdersRepository {
  async create(data: IOrderData): Promise<IOrderData> {
    // Update the product if it already exists or create it otherwise
    data.products.map(async (product) => {
      const productExists = await prismaClient.products.findFirst({
        where: {
          id: product.id,
        }
      });

      if (productExists !== null) {
        await prismaClient.products.update({
          where: {
            id: product.id,
          },
          data: {
            id: product.id,
            name: product.name,
            price: product.price,
          }
        });
      } else {
        console.log("ProductCreated: " + product.id)
        console.log("ProductCreated: " + product.name)
        await prismaClient.products.create({
          data: {
            id: product.id,
            name: product.name,
            price: product.price,
          }
        });
      }
    });

    const userExists = await prismaClient.users.findFirst({
      where: {
        id: data.user.id,
      }
    });

    if (userExists !== null && (userExists.name !== data.user.name || userExists.email !== data.user.email)) {
      await prismaClient.users.update({
        where: {
          id: data.user.id,
        },
        data: {
          name: data.user.name,
          email: data.user.email,
        }
      });
    } else {
      await prismaClient.users.create({
        data: {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
        },
      });
    }


    const order = await prismaClient.orders.create({
      data: {
        id: data.id,
        total: data.total,
        user: {
          connect: {
            id: data.user.id
          },
        },
        products: {
          connect: data.products.map(product => {
            return {
              id: product.id,
            }
          }),
        },
        productsAmount: {
          createMany: {
            data: data.products.map(product => {
              return {
                amount: product.amount,
                productId: product.id
              }
            }),
          },
        },
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
      include: {
        products: true,
        user: true,
        productsAmount: true,
      },
    });

    const OrderFormatted = {
      id: order.id,
      user: {
        id: order.user.id,
        name: order.user.name,
        email: order.user.email,
      },
      products: order.products.map(product => {
        const productAmount = order.productsAmount.find(productAmount => productAmount.productId === product.id);

        return {
          ...product,
          amount: Number(productAmount?.amount),
          price: Number(product.price),
        }
      }),
      total: Number(order.total),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };

    return OrderFormatted;
  };

  async listAll(): Promise<IOrderData[]> {
    const orders = await prismaClient.orders.findMany({
      include: {
        user: true,
        products: true,
        productsAmount: true,
      },
    });

    const OrdersFormatted = orders.map(order => {
      return {
        id: order.id,
        user: {
          id: order.user.id,
          name: order.user.name,
          email: order.user.email,
        },
        products: order.products.map(product => {
          const productAmount = order.productsAmount.find(productAmount => productAmount.productId === product.id);

          return {
            ...product,
            amount: Number(productAmount?.amount),
            price: Number(product.price),
          }
        }),
        total: Number(order.total),
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      }
    });

    return OrdersFormatted;
  }
}