import { container } from "tsyringe";

import { PrismaUsersRepository } from "../infra/database/prisma/repositories/PrismaUsersRepository";
import { BcryptEncoder } from "../infra/encoder/BcryptEncoder";
import { IEncoder } from "../useCases/ports/IEncoder";
import { IUsersRepository } from "../useCases/ports/IUsersRepository";

container.registerSingleton<IUsersRepository>(
  "UsersRepository",
  PrismaUsersRepository
);

container.registerSingleton<IEncoder>(
  "Encoder",
  BcryptEncoder
);