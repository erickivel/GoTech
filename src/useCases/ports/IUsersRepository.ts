import { IUserData } from "./IUserData";

export interface IUsersRepository {
  create(data: IUserData): Promise<Omit<IUserData, "password" | "createdAt">>;
  findByEmail(email: string): Promise<IUserData | null>;
  findById(id: string): Promise<IUserData | null>;
}
