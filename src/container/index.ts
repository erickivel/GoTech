import { container } from "tsyringe";

import { JwtAuthenticationTokenProvider } from "../infra/authentication/JwtAuthenticationTokenProvider";
import { PrismaUsersRepository } from "../infra/database/prisma/repositories/PrismaUsersRepository";
import { BcryptEncoder } from "../infra/encoder/BcryptEncoder";
import { IAuthenticationTokenProvider } from "../useCases/ports/IAuthenticationTokenProvider";
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

container.registerSingleton<IAuthenticationTokenProvider>(
  "AuthenticationTokenProvider",
  JwtAuthenticationTokenProvider
);