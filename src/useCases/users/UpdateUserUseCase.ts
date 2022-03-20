import { inject, injectable } from "tsyringe";

import { Either, left, right } from "../../core/logic/Either";
import { InvalidEmailError } from "../../domain/entities/errors/InvalidEmailError";
import { InvalidNameError } from "../../domain/entities/errors/InvalidNameError";
import { InvalidPasswordError } from "../../domain/entities/errors/InvalidPasswordError";
import { User } from "../../domain/entities/User";
import { IEncoder } from "../ports/IEncoder";
import { IUpdatedUserData } from "../ports/IUpdatedUserData";
import { IUsersRepository } from "../ports/IUsersRepository";
import { EmailIsAlreadyTakenError } from "./errors/EmailIsAlreadyTakenError";
import { IncorrectPasswordError } from "./errors/IncorrectPasswordError";
import { UnmatchedPasswordError } from "./errors/UnmatchedPasswordError";
import { UserNotFoundError } from "./errors/UserNotFoundError";

export interface IRequest {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  new_password?: string;
  confirm_password?: string;
};

@injectable()
export class UpdateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("Encoder")
    private encoder: IEncoder,
  ) { }

  async execute({
    user_id,
    name,
    email,
    old_password,
    new_password,
    confirm_password
  }: IRequest): Promise<
    Either<
      | EmailIsAlreadyTakenError
      | UserNotFoundError
      | IncorrectPasswordError
      | UnmatchedPasswordError
      | InvalidNameError
      | InvalidEmailError
      | InvalidPasswordError,
      IUpdatedUserData
    >
  > {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      return left(new UserNotFoundError(user_id));
    };

    const emailIsUsed = await this.usersRepository.findByEmail(email);

    if (emailIsUsed && emailIsUsed.id !== user.id) {
      return left(new EmailIsAlreadyTakenError(email));
    };

    const paramsToUpdate = {
      id: user.id,
      email,
      name,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    if (old_password && new_password && confirm_password) {
      const passwordIsCorrect = await this.encoder.compare(old_password, user.password);

      if (!passwordIsCorrect) {
        return left(new IncorrectPasswordError());
      };

      if (new_password !== confirm_password) {
        return left(new UnmatchedPasswordError())
      }

      if (new_password.length > 255 || new_password.length < 6) {
        return left(new InvalidPasswordError());
      }

      const newPasswordHash = await this.encoder.encode(new_password);

      paramsToUpdate.password = newPasswordHash;
    }

    paramsToUpdate.updatedAt = new Date();

    const userOrError = User.create(paramsToUpdate);

    if (userOrError.isLeft()) {
      return left(userOrError.value);
    };

    const userUpdated = await this.usersRepository.update(userOrError.value);

    return right(userUpdated);
  };
};