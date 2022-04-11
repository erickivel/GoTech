import { container } from "tsyringe";

import { PrismaOrdersRepository } from "../infra/database/prisma/repositories/PrismaOrdersRepository";
import { SQSMessagingAdapter } from "../infra/messaging/SQSMessagingAdapter";
import { IMessagingAdapter } from "../useCases/orders/ports/IMessagingAdapter";
import { IOrdersRepository } from "../useCases/orders/ports/IOrdersRepository";

container.registerSingleton<IOrdersRepository>(
  "OrdersRepository",
  PrismaOrdersRepository
);

container.registerSingleton<IMessagingAdapter>(
  "MessagingAdapter",
  SQSMessagingAdapter
);