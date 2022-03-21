import { Router } from 'express';

import { SignInUserController } from '../../../controllers/users/SignInUserController';
import { routeAdapter } from './RouteAdapter';

export const authenticateRoutes = Router();

const signInUserController = new SignInUserController();

authenticateRoutes.post("/sessions", routeAdapter(signInUserController));
