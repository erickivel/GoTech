import { IUserData } from "../../../src/useCases/authentication/ports/IUserData";
import { IUsersRepository } from "../../../src/useCases/authentication/ports/IUsersRepository";

export class UsersRepositoryInMemory implements IUsersRepository {
  users: IUserData[] = [];

  async create(data: IUserData): Promise<Omit<IUserData, "password" | "isAdmin">> {
    this.users.push(data);

    const user = {
      id: data.id,
      name: data.name,
      email: data.email,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };

    return user;
  };

  async findByEmail(email: string): Promise<IUserData | null> {
    const user = this.users.find((user) => user.email === email);

    return user || null;
  };

  async findById(id: string): Promise<IUserData | null> {
    const user = this.users.find((user) => user.id === id);

    return user || null;
  };
};
