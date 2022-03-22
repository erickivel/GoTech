import { inject, injectable } from "tsyringe";

import { Either, left, right } from "../../core/logic/Either";
import { UserIsNotAdminError } from "./errors/UserIsNotAdminError";
import { UserNotFoundError } from "./errors/UserNotFoundError";
import { IListUsersResponse } from "./ports/IListUsersResponse";
import { IUsersRepository } from "./ports/IUsersRepository";

interface IRequest {
  user_id: string;
};

@injectable()
export class ListAllUsersUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) { }

  async execute({ user_id }: IRequest): Promise<Either<UserNotFoundError | UserIsNotAdminError, IListUsersResponse>> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      return left(new UserNotFoundError(user_id));
    };

    if (user.isAdmin === false) {
      return left(new UserIsNotAdminError());
    };

    const users = await this.usersRepository.listAll();

    return right(users);
  };
};