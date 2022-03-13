import { Router } from 'express';

import { CreateUserController } from '../../../controllers/users/CreateUserController';
import { routeAdapter } from './RouteAdapter';

export const usersRoutes = Router();

const createUserController = new CreateUserController();

usersRoutes.post("/signup", routeAdapter(createUserController));