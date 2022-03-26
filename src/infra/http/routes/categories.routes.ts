import { Router } from "express";

import { CreateCategoryController } from "../../../controllers/categories/CreateCategoryController";
import { ListAllCategoriesController } from "../../../controllers/categories/ListAllCategoriesController";
import { UpdateCategoryController } from "../../../controllers/categories/UpdateCategoryController";
import { adaptedEnsureAdmin } from "../middlewares/adaptedEnsureAdmin";
import { routeAdapter } from "./RouteAdapter";

export const categoriesRoutes = Router();

const createCategoryController = new CreateCategoryController();
const listAllCategoriesController = new ListAllCategoriesController()
const updateCategoryController = new UpdateCategoryController()

categoriesRoutes.post("/", adaptedEnsureAdmin, routeAdapter(createCategoryController));
categoriesRoutes.get("/", routeAdapter(listAllCategoriesController));
categoriesRoutes.put("/update/:id", adaptedEnsureAdmin, routeAdapter(updateCategoryController));