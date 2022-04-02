import "reflect-metadata";
import { container } from 'tsyringe';
import "../../../container";

import { EnsureAuthenticated } from '../../../middlewares/ensureAuthenticatedMiddleware';

export const handle = async (event: any) => {
  const ensureAuthenticatedMiddleware = container.resolve(EnsureAuthenticated);

  const response = await ensureAuthenticatedMiddleware.handle(event);

  console.log(response);

  if (response.isLeft()) {
    return {
      "isAuthorized": false,
    }
  }

  const userId = response.value;

  return {
    "isAuthorized": true,
    "context": {
      "user": {
        "id": userId
      }
    }
  }
}