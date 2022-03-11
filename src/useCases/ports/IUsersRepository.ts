import { IUserData } from "./IUserData";

export interface IUsersRepository {
  create(data: IUserData): Promise<void>;
  findByEmail(email: string): Promise<IUserData | null>;
}
