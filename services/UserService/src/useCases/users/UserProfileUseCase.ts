import { inject, injectable } from "tsyringe";

import { Either, left, right } from "../../logic/Either";
import { UserNotFoundError } from "./errors/UserNotFoundError";
import { IUsersRepository } from "./ports/IUsersRepository";

interface IRequest {
  user_id: string;
};

interface IResponse {
  id: string;
  name: string;
  email: string;
}

@injectable()
export class UserProfileUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) { }

  async execute({ user_id }: IRequest): Promise<Either<UserNotFoundError, IResponse>> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      return left(new UserNotFoundError(user_id));
    };

    const userMapped: IResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    return right(userMapped);
  };
};