import { IUpdatedUserData } from "./IUpdatedUserData";
import { IUserData } from "./IUserData";

export interface IUsersRepository {
  create(data: IUserData): Promise<Omit<IUserData, "password">>;
  findByEmail(email: string): Promise<IUserData | null>;
  findById(id: string): Promise<IUserData | null>;
  update(data: IUserData): Promise<IUpdatedUserData>
}
