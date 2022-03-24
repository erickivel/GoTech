import { container } from "tsyringe";

import { EnsureAdmin } from "../../../middlewares/ensureAdmin";
import { MiddlewareRouteAdapter } from "./MiddlewareAdapter";

const ensureAdmin = container.resolve(EnsureAdmin);

export const adaptedEnsureAdmin = MiddlewareRouteAdapter(ensureAdmin);