import { IUserData } from "./IUserData";

export interface IUsersRepository {
  findByEmail(email: string): Promise<IUserData | null>;
  findById(id: string): Promise<IUserData | null>;
};
