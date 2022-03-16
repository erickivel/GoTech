import { Router } from 'express';

import { CreateUserController } from '../../../controllers/users/CreateUserController';
import { SignInUserController } from '../../../controllers/users/SignInUserController';
import { routeAdapter } from './RouteAdapter';

export const usersRoutes = Router();

const createUserController = new CreateUserController();
const signInUserController = new SignInUserController();

usersRoutes.post("/cadastrar", routeAdapter(createUserController));
usersRoutes.post("/entrar", routeAdapter(signInUserController));
