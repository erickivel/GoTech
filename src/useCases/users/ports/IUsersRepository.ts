import { IListUsersResponse } from "./IListUsersResponse";
import { IUpdatedUserData } from "./IUpdatedUserData";
import { IUserData } from "./IUserData";

export interface IUsersRepository {
  create(data: IUserData): Promise<Omit<IUserData, "password" | "isAdmin">>;
  findByEmail(email: string): Promise<IUserData | null>;
  findById(id: string): Promise<IUserData | null>;
  update(data: IUserData): Promise<IUpdatedUserData>;
  listAll(): Promise<IListUsersResponse>;
};
