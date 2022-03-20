import { Router } from 'express';

import { CreateUserController } from '../../../controllers/users/CreateUserController';
import { SignInUserController } from '../../../controllers/users/SignInUserController';
import { UserProfileController } from '../../../controllers/users/UserProfileController';
import { adaptedEnsureAuthenticated } from '../middlewares/adaptedEnsureAuthenticated';
import { routeAdapter } from './RouteAdapter';

export const usersRoutes = Router();

const createUserController = new CreateUserController();
const signInUserController = new SignInUserController();
const userProfileController = new UserProfileController();



usersRoutes.post("/signup", routeAdapter(createUserController));
usersRoutes.post("/signin", routeAdapter(signInUserController));
usersRoutes.get("/profile", adaptedEnsureAuthenticated, routeAdapter(userProfileController));
