import { inject, injectable } from "tsyringe";

import { Either, left, right } from "../../core/logic/Either";
import { UserNotFoundError } from "./errors/UserNotFoundError";
import { IUsersRepository } from "./ports/IUsersRepository";

interface IRequest {
  userIdToBeDeleted: string;
};

@injectable()
export class DeleteUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) { }

  async execute({ userIdToBeDeleted }: IRequest): Promise<Either<UserNotFoundError, null>> {
    const user = await this.usersRepository.findById(userIdToBeDeleted);

    if (!user) {
      return left(new UserNotFoundError(userIdToBeDeleted));
    };

    await this.usersRepository.deleteOne(userIdToBeDeleted);

    return right(null);
  };
};