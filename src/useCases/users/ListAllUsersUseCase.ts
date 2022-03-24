import { inject, injectable } from "tsyringe";

import { Either, right } from "../../core/logic/Either";
import { IListUsersResponse } from "./ports/IListUsersResponse";
import { IUsersRepository } from "./ports/IUsersRepository";

@injectable()
export class ListAllUsersUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) { }

  async execute(): Promise<Either<void, IListUsersResponse>> {
    const users = await this.usersRepository.listAll();

    return right(users);
  };
};