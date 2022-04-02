import "reflect-metadata";
import "../../../container";

import { SignInUserController } from "../../../controllers/authentication/SignInUserController"

export const handle = (event: any) => {
  const signInUserController = new SignInUserController();

  const response = signInUserController.handle(event);

  return response;
}