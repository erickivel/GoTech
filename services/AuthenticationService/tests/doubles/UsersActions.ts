import { inject, injectable } from "tsyringe";

import { IUserData } from "../../src/useCases/authentication/ports/IUserData";
import { IUsersRepository } from "../../src/useCases/authentication/ports/IUsersRepository";

@injectable()
export class UsersActions {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
  ) { }

  async create(data: IUserData): Promise<Omit<IUserData, "password" | "isAdmin">> {
    const user = await this.usersRepository.create(data);

    return user;
  };
};