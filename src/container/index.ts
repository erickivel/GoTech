import { container } from "tsyringe";

import { JwtAuthenticationTokenProvider } from "../infra/authentication/JwtAuthenticationTokenProvider";
import { PrismaCategoriesRepository } from "../infra/database/prisma/repositories/PrismaCategoriesRepository";
import { PrismaUsersRepository } from "../infra/database/prisma/repositories/PrismaUsersRepository";
import { BcryptEncoder } from "../infra/encoder/BcryptEncoder";
import { ICategoriesRepository } from "../useCases/categories/ports/ICategoriesRepository";
import { IAuthenticationTokenProvider } from "../useCases/users/ports/IAuthenticationTokenProvider";
import { IEncoder } from "../useCases/users/ports/IEncoder";
import { IUsersRepository } from "../useCases/users/ports/IUsersRepository";

container.registerSingleton<IUsersRepository>(
  "UsersRepository",
  PrismaUsersRepository
);

container.registerSingleton<ICategoriesRepository>(
  "CategoriesRepository",
  PrismaCategoriesRepository
);

container.registerSingleton<IEncoder>(
  "Encoder",
  BcryptEncoder
);

container.registerSingleton<IAuthenticationTokenProvider>(
  "AuthenticationTokenProvider",
  JwtAuthenticationTokenProvider
);