import { Router } from 'express';

import { CreateUserController } from '../../../controllers/users/CreateUserController';
import { ListAllUsersController } from '../../../controllers/users/ListAllUsersController';
import { UpdateUserController } from '../../../controllers/users/UpdateUserController';
import { UserProfileController } from '../../../controllers/users/UserProfileController';
import { adaptedEnsureAdmin } from '../middlewares/adaptedEnsureAdmin';
import { adaptedEnsureAuthenticated } from '../middlewares/adaptedEnsureAuthenticated';
import { routeAdapter } from './RouteAdapter';

export const usersRoutes = Router();

const createUserController = new CreateUserController();
const updateUserController = new UpdateUserController();
const userProfileController = new UserProfileController();
const listAllUsersController = new ListAllUsersController();




usersRoutes.post("/", routeAdapter(createUserController));
usersRoutes.put("/update", adaptedEnsureAuthenticated, routeAdapter(updateUserController));
usersRoutes.get("/", adaptedEnsureAdmin, routeAdapter(listAllUsersController));
usersRoutes.get("/profile", adaptedEnsureAuthenticated, routeAdapter(userProfileController));