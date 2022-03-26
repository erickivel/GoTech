import { ICategoriesRepository } from "../../../../useCases/categories/ports/ICategoriesRepository";
import { ICategoryData } from "../../../../useCases/categories/ports/ICategoryData";
import { prismaClient } from "../PrismaClient";

export class PrismaCategoriesRepository implements ICategoriesRepository {
  async create(data: ICategoryData): Promise<ICategoryData> {
    const categoryCreated = await prismaClient.categories.create({
      data: {
        id: data.id,
        name: data.name,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      }
    });

    return categoryCreated;
  }
  async findByName(name: string): Promise<ICategoryData | null> {
    const categoryOrNull = await prismaClient.categories.findFirst({
      where: {
        name,
      }
    });

    return categoryOrNull;
  };

  async listAll(): Promise<ICategoryData[]> {
    const categories = await prismaClient.categories.findMany();

    return categories;
  };

  async findById(id: string): Promise<ICategoryData | null> {
    const categoryOrNull = await prismaClient.categories.findFirst({
      where: {
        id,
      },
    });

    return categoryOrNull;
  };

  async update(data: ICategoryData): Promise<ICategoryData> {
    const categoryUpdated = await prismaClient.categories.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        updatedAt: data.updatedAt,
      },
    });

    return categoryUpdated;
  }
};