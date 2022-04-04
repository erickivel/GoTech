import { inject, injectable } from "tsyringe";

import { IListUsersResponse } from "../../src/useCases/users/ports/IListUsersResponse";
import { IUserData } from "../../src/useCases/users/ports/IUserData";
import { IUsersRepository } from "../../src/useCases/users/ports/IUsersRepository";

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

  async listAll(): Promise<IListUsersResponse> {
    const users = await this.usersRepository.listAll();

    return users;
  };

  async findByEmail(email: string): Promise<IUserData> {
    const user = await this.findByEmail(email);

    return user;
  }
};