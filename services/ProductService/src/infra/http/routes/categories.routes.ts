import { Router } from "express";

import { CreateCategoryController } from "../../../controllers/categories/CreateCategoryController";
import { DeleteCategoryController } from "../../../controllers/categories/DeleteCategoryController";
import { ListAllCategoriesController } from "../../../controllers/categories/ListAllCategoriesController";
import { UpdateCategoryController } from "../../../controllers/categories/UpdateCategoryController";
import { routeAdapter } from "./RouteAdapter";

export const categoriesRoutes = Router();

const createCategoryController = new CreateCategoryController();
const listAllCategoriesController = new ListAllCategoriesController();
const updateCategoryController = new UpdateCategoryController();
const deleteCategoryController = new DeleteCategoryController();

categoriesRoutes.post("/", routeAdapter(createCategoryController));
categoriesRoutes.put("/update/:id", routeAdapter(updateCategoryController));
categoriesRoutes.delete("/delete/:category_id", routeAdapter(deleteCategoryController));
categoriesRoutes.get("/", routeAdapter(listAllCategoriesController));