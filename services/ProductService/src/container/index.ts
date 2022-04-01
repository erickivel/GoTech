import { container } from "tsyringe";

import { PrismaCategoriesRepository } from "../infra/database/prisma/repositories/PrismaCategoriesRepository";
import { ICategoriesRepository } from "../useCases/categories/ports/ICategoriesRepository";

container.registerSingleton<ICategoriesRepository>(
  "CategoriesRepository",
  PrismaCategoriesRepository
);