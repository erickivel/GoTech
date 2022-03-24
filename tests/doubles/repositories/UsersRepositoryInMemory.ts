import { IListUsersResponse } from "../../../src/useCases/users/ports/IListUsersResponse";
import { IUpdatedUserData } from "../../../src/useCases/users/ports/IUpdatedUserData";
import { IUserData } from "../../../src/useCases/users/ports/IUserData";
import { IUsersRepository } from "../../../src/useCases/users/ports/IUsersRepository";

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

  async update(data: IUserData): Promise<IUpdatedUserData> {
    const userIndex = this.users.findIndex(user => user.id === data.id);

    this.users[userIndex] = data;


    const userUpdated = {
      id: this.users[userIndex].id,
      name: this.users[userIndex].name,
      email: this.users[userIndex].email,
    }

    return userUpdated;
  };

  async listAll(): Promise<IListUsersResponse> {
    const usersFormatted = this.users.map(user => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
    });

    return usersFormatted;
  }

  async deleteOne(id: string): Promise<void> {
    const userIndex = this.users.findIndex(user => user.id === id);

    this.users.splice(userIndex, 1);
  }
};
