import "reflect-metadata";
import "../../../container";

import { SignInUserController } from "../../../controllers/authentication/SignInUserController"
import { MiddyMiddleware } from "../utils/commonMiddleware";

const SignInUser = async (event: any) => {
  const signInUserController = new SignInUserController();

  const response = await signInUserController.handle(event);

  return {
    statusCode: response.statusCode,
    body: JSON.stringify(response.body)
  };
};

export const handle = MiddyMiddleware(SignInUser);