import { Router } from "express";

import { ListAllProductsController } from "../../../controllers/products/ListAllProductsController";
import { routeAdapter } from "./RouteAdapter";

export const productsRoutes = Router();

const listAllProductsController = new ListAllProductsController();

productsRoutes.get("/", routeAdapter(listAllProductsController));