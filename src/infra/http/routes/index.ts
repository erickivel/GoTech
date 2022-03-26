import { Router } from 'express';

import { authenticateRoutes } from './authenticate.routes';
import { categoriesRoutes } from './categories.routes';
import { usersRoutes } from './users.routes';

const router = Router();

router.use("/users", usersRoutes);
router.use("/", authenticateRoutes);
router.use("/categories", categoriesRoutes);

export { router };