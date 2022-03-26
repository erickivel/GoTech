import { Router } from "express";

import { CreateCategoryController } from "../../../controllers/categories/CreateCategoryController";
import { adaptedEnsureAdmin } from "../middlewares/adaptedEnsureAdmin";
import { routeAdapter } from "./RouteAdapter";

export const categoriesRoutes = Router();

const createCategoryController = new CreateCategoryController();

categoriesRoutes.post("/", adaptedEnsureAdmin, routeAdapter(createCategoryController));