import { IUserData } from "./IUserData";

export type IListUsersResponse = Omit<IUserData, "password" | "isAdmin">[];