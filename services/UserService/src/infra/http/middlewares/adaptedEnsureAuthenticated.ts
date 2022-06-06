import { container } from "tsyringe";

import { EnsureAuthenticated } from "../../../middlewares/ensureAuthenticated";
import { MiddlewareRouteAdapter } from "./MiddlewareAdapter";

const ensureAuthenticated = container.resolve(EnsureAuthenticated);

export const adaptedEnsureAuthenticated = MiddlewareRouteAdapter(ensureAuthenticated);