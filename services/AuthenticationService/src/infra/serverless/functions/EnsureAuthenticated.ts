import "reflect-metadata";
import { container } from 'tsyringe';
import "../../../container";

import { EnsureAuthenticated } from '../../../middlewares/ensureAuthenticatedMiddleware';

export const handle = async (event: any) => {
  const ensureAuthenticatedMiddleware = container.resolve(EnsureAuthenticated);

  const response = await ensureAuthenticatedMiddleware.handle(event);

  if (response.isLeft()) {
    return {
      "isAuthorized": false,
    }
  }

  const user = response.value;

  return {
    "isAuthorized": true,
    "context": {
      "user": user,
    },
  };
};