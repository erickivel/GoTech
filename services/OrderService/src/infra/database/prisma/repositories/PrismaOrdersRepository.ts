import { IOrderData } from "../../../../useCases/orders/ports/IOrderData";
import { IOrdersRepository } from "../../../../useCases/orders/ports/IOrdersRepository";
import { prismaClient } from "../PrismaClient";

export class PrismaOrdersRepository implements IOrdersRepository {
  async create(data: IOrderData): Promise<IOrderData> {
    await prismaClient.products.createMany({
      data: data.products.map(product => {
        return {
          id: product.id,
          name: product.name,
          price: product.price,
          amount: product.amount,
        }
      }),
      skipDuplicates: true,
    });


    const order = await prismaClient.orders.create({
      data: {
        id: data.id,
        total: data.total,
        user: {
          connectOrCreate: {
            where: {
              id: data.user.id
            },
            create: {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
            }
          }
        },
        products: {
          connect: data.products.map(product => {
            return {
              id: product.id,
            }
          }),
        },
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
      include: {
        products: true,
        user: true,
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
        return {
          ...product,
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
          return {
            ...product,
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