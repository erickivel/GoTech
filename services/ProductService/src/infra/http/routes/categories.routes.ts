import { Router } from "express";

import { CreateCategoryController } from "../../../controllers/categories/CreateCategoryController";
import { DeleteCategoryController } from "../../../controllers/categories/DeleteCategoryController";
import { ListAllCategoriesController } from "../../../controllers/categories/ListAllCategoriesController";
import { UpdateCategoryController } from "../../../controllers/categories/UpdateCategoryController";
import { adaptedEnsureAdmin } from "../middlewares/adaptedEnsureAdmin";
import { routeAdapter } from "./RouteAdapter";

export const categoriesRoutes = Router();

const createCategoryController = new CreateCategoryController();
const listAllCategoriesController = new ListAllCategoriesController();
const updateCategoryController = new UpdateCategoryController();
const deleteCategoryController = new DeleteCategoryController();

categoriesRoutes.post("/", adaptedEnsureAdmin, routeAdapter(createCategoryController));
categoriesRoutes.get("/", routeAdapter(listAllCategoriesController));
categoriesRoutes.put("/update/:id", adaptedEnsureAdmin, routeAdapter(updateCategoryController));
categoriesRoutes.delete("/delete/:category_id", adaptedEnsureAdmin, routeAdapter(deleteCategoryController));