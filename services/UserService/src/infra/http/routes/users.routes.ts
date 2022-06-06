import { Router } from 'express';

import { AdminUpdateUserController } from '../../../controllers/users/AdminUpdateUserController';
import { CreateUserController } from '../../../controllers/users/CreateUserController';
import { DeleteUserController } from '../../../controllers/users/DeleteUserController';
import { ListAllUsersController } from '../../../controllers/users/ListAllUsersController';
import { UpdateUserController } from '../../../controllers/users/UpdateUserController';
import { UserProfileController } from '../../../controllers/users/UserProfileController';
import { routeAdapter } from './RouteAdapter';

import { UserIdTestMiddleware } from '../../../../tests/doubles/UserIdTestMiddleware';
import { adaptedEnsureAuthenticated } from '../middlewares/adaptedEnsureAuthenticated';
import { adaptedEnsureAdmin } from '../middlewares/adaptedEnsureAdmin';

export const usersRoutes = Router();

const createUserController = new CreateUserController();
const updateUserController = new UpdateUserController();
const userProfileController = new UserProfileController();
const listAllUsersController = new ListAllUsersController();
const deleteUserController = new DeleteUserController();
const adminUpdateUserController = new AdminUpdateUserController()

if (process.env.TEST === 'true') {
  usersRoutes.post("/", routeAdapter(createUserController));
  usersRoutes.put("/update", UserIdTestMiddleware, routeAdapter(updateUserController));
  usersRoutes.get("/", UserIdTestMiddleware, routeAdapter(listAllUsersController));
  usersRoutes.get("/profile", UserIdTestMiddleware, routeAdapter(userProfileController));
  usersRoutes.delete("/:user_id", UserIdTestMiddleware, routeAdapter(deleteUserController));
  usersRoutes.put("/admin/update", UserIdTestMiddleware, routeAdapter(adminUpdateUserController));
} else {
  usersRoutes.post("/", routeAdapter(createUserController));
  usersRoutes.put("/update", adaptedEnsureAuthenticated, routeAdapter(updateUserController));
  usersRoutes.get("/", adaptedEnsureAdmin, routeAdapter(listAllUsersController));
  usersRoutes.get("/profile", adaptedEnsureAuthenticated, routeAdapter(userProfileController));
  usersRoutes.delete("/:user_id", adaptedEnsureAdmin, routeAdapter(deleteUserController));
  usersRoutes.put("/admin/update", adaptedEnsureAdmin, routeAdapter(adminUpdateUserController));
}