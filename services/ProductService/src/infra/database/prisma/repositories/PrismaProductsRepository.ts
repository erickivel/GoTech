import { prismaClient } from "../PrismaClient";
import { IProductsRepository } from "../../../../useCases/products/ports/IProductsRepository";
import { IProductData } from "../../../../useCases/products/ports/IProductData";

export class PrismaProductsRepository implements IProductsRepository {
  async create(data: IProductData): Promise<IProductData> {
    const productCreated = await prismaClient.products.create({
      data: {
        id: data.id,
        name: data.name,
        price: data.price,
        stock: data.stock,
        categoryId: data.categoryId,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      }
    });

    return {
      ...productCreated,
      price: Number(productCreated.price),
    };
  }
  async findByName(name: string): Promise<IProductData | null> {
    const productOrNull = await prismaClient.products.findFirst({
      where: {
        name,
      },
      include: {
        category: true,
      },
    });

    return productOrNull ? {
      ...productOrNull,
      price: Number(productOrNull.price),
    } : null;
  };
};