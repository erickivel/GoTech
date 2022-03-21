import { Router } from 'express';

import { CreateUserController } from '../../../controllers/users/CreateUserController';
import { UpdateUserController } from '../../../controllers/users/UpdateUserController';
import { UserProfileController } from '../../../controllers/users/UserProfileController';
import { adaptedEnsureAuthenticated } from '../middlewares/adaptedEnsureAuthenticated';
import { routeAdapter } from './RouteAdapter';

export const usersRoutes = Router();

const createUserController = new CreateUserController();
const userProfileController = new UserProfileController();
const updateUserController = new UpdateUserController();



usersRoutes.post("/", routeAdapter(createUserController));
usersRoutes.get("/profile", adaptedEnsureAuthenticated, routeAdapter(userProfileController));
usersRoutes.put("/update", adaptedEnsureAuthenticated, routeAdapter(updateUserController));