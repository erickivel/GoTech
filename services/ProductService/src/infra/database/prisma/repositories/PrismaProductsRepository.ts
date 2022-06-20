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
      },
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

    return productOrNull
      ? {
          ...productOrNull,
          price: Number(productOrNull.price),
        }
      : null;
  }

  async listAll(): Promise<IProductData[]> {
    const products = await prismaClient.products.findMany({
      include: {
        category: true,
      },
    });

    const formattedProducts = products.map((product: any) => {
      return {
        ...product,
        price: Number(product.price),
      };
    });

    return formattedProducts;
  }

  async findById(id: string): Promise<IProductData | null> {
    const productOrNull = await prismaClient.products.findFirst({
      where: {
        id,
      },
    });

    return productOrNull
      ? {
          ...productOrNull,
          price: Number(productOrNull.price),
        }
      : null;
  }

  async updateStock(id: string, newStock: number): Promise<void> {
    await prismaClient.products.update({
      where: {
        id,
      },
      data: {
        stock: newStock,
      },
    });
  }

  async deleteOne(product_id: string): Promise<void> {
    await prismaClient.products.delete({
      where: { id: product_id },
    });
  }

  async update(data: IProductData): Promise<IProductData> {
    const productUpdated = await prismaClient.products.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        price: data.price,
        stock: data.stock,
        categoryId: data.categoryId,
        updatedAt: data.updatedAt,
      },
    });

    return {
      ...productUpdated,
      price: Number(productUpdated.price),
    };
  }
}

