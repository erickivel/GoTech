import { inject, injectable } from "tsyringe";

import { Either, left, right } from "../../core/logic/Either";
import { IncorrectCredentialsError } from "./errors/IncorrectCredentialsError";
import { IAuthenticationTokenProvider } from "./ports/IAuthenticationTokenProvider";
import { IEncoder } from "./ports/IEncoder";
import { IUsersRepository } from "./ports/IUsersRepository";

interface IRequest {
  email: string;
  password: string;
};

interface IResponse {
  user: {
    name: string;
    email: string;
  },
  token: string;
};

@injectable()
export class SignInUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("Encoder")
    private encoder: IEncoder,
    @inject("AuthenticationTokenProvider")
    private authenticationTokenProvider: IAuthenticationTokenProvider,
  ) { }

  async execute({ email, password }: IRequest): Promise<Either<IncorrectCredentialsError, IResponse>> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      return left(new IncorrectCredentialsError());
    }

    const passwordMatch = await this.encoder.compare(password, user.password);

    if (!passwordMatch) {
      return left(new IncorrectCredentialsError());
    }

    const token = this.authenticationTokenProvider.generateToken(user.id);

    return right({
      user: {
        name: user.name,
        email: user.email
      },
      token,
    });
  };
};