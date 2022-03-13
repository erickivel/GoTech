import { container } from "tsyringe";

import { FakeEncoder } from "../../tests/doubles/FakeEncoder";
import { UsersRepositoryInMemory } from "../../tests/doubles/repositories/UsersRepositoryInMemory";
import { IEncoder } from "../useCases/ports/IEncoder";
import { IUsersRepository } from "../useCases/ports/IUsersRepository";

container.registerSingleton<IUsersRepository>(
  "UsersRepository",
  UsersRepositoryInMemory
);

container.registerSingleton<IEncoder>(
  "Encoder",
  FakeEncoder
);
