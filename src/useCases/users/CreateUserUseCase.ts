import { inject, injectable } from 'tsyringe';

import { Either, left, right } from "../../core/logic/Either";
import { InvalidEmailError } from "../../domain/entities/errors/InvalidEmailError";
import { InvalidNameError } from "../../domain/entities/errors/InvalidNameError";
import { InvalidPasswordError } from "../../domain/entities/errors/InvalidPasswordError";
import { User } from "../../domain/entities/User";
import { IEncoder } from "../ports/IEncoder";
import { IUsersRepository } from "../ports/IUsersRepository";
import { UserAlreadyExistsError } from "./errors/UserAlreadyExistsError";

interface IRequest {
  name: string;
  email: string;
  password: string;
}

export interface IResponse {
  id: string;
  name: string;
  email: string;
};

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("Encoder")
    private encoder: IEncoder,
  ) { }

  async execute({
    name,
    email,
    password,
  }: IRequest): Promise<
    Either<
      | UserAlreadyExistsError
      | InvalidNameError
      | InvalidEmailError
      | InvalidPasswordError,
      IResponse
    >
  > {
    const userExists = await this.usersRepository.findByEmail(email);

    if (userExists) {
      return left(new UserAlreadyExistsError(email));
    }

    const userOrError = User.create({
      name,
      email,
      password,
    });

    if (userOrError.isLeft()) {
      return left(userOrError.value);
    }

    const passwordHash = await this.encoder.encode(userOrError.value.password);

    const user = await this.usersRepository.create({
      ...userOrError.value,
      password: passwordHash
    });

    const userMapped = {
      id: user.id,
      name: user.name,
      email: user.email,
    }

    return right(userMapped);
  }
}
