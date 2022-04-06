import { container } from "tsyringe";

import { PrismaOrdersRepository } from "../infra/database/prisma/repositories/PrismaOrdersRepository";
import { IOrdersRepository } from "../useCases/orders/ports/IOrdersRepository";

container.registerSingleton<IOrdersRepository>(
  "OrdersRepository",
  PrismaOrdersRepository
);