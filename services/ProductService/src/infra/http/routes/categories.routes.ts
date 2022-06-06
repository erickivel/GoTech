import { Router } from "express";

import { ListAllCategoriesController } from "../../../controllers/categories/ListAllCategoriesController";
import { routeAdapter } from "./RouteAdapter";

export const categoriesRoutes = Router();

const listAllCategoriesController = new ListAllCategoriesController();

categoriesRoutes.get("/", routeAdapter(listAllCategoriesController));