import { Router } from "express";

import { CreateCategoryController } from "../../../controllers/categories/CreateCategoryController";
import { ListAllCategoriesController } from "../../../controllers/categories/ListAllCategoriesController";
import { adaptedEnsureAdmin } from "../middlewares/adaptedEnsureAdmin";
import { routeAdapter } from "./RouteAdapter";

export const categoriesRoutes = Router();

const createCategoryController = new CreateCategoryController();
const listAllCategoriesController = new ListAllCategoriesController()

categoriesRoutes.post("/", adaptedEnsureAdmin, routeAdapter(createCategoryController));
categoriesRoutes.get("/", routeAdapter(listAllCategoriesController));