import { container } from "tsyringe";

import { PrismaCategoriesRepository } from "../infra/database/prisma/repositories/PrismaCategoriesRepository";
import { PrismaProductsRepository } from "../infra/database/prisma/repositories/PrismaProductsRepository";
import { ICategoriesRepository } from "../useCases/categories/ports/ICategoriesRepository";
import { IProductsRepository } from "../useCases/products/ports/IProductsRepository";

container.registerSingleton<ICategoriesRepository>(
  "CategoriesRepository",
  PrismaCategoriesRepository
);

container.registerSingleton<IProductsRepository>(
  "ProductsRepository",
  PrismaProductsRepository
);