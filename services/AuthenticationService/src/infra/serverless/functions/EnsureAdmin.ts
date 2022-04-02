import "reflect-metadata";
import { container } from 'tsyringe';
import "../../../container";

import { EnsureAdmin } from '../../../middlewares/ensureAdminMiddleware';

export const handle = async (event: any) => {
  const ensureAdminMiddleware = container.resolve(EnsureAdmin);

  const response = await ensureAdminMiddleware.handle(event);

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
      },
    },
  }
}