import "reflect-metadata";
import "../../../container";

import { UpdateCategoryController } from "../../../controllers/categories/UpdateCategoryController";
import { MiddyMiddleware } from "../utils/commonMiddleware";

const UpdateCategory = async (event: any) => {
  const updateCategoryController = new UpdateCategoryController();

  const response = await updateCategoryController.handle(event);

  return {
    statusCode: response.statusCode,
    body: JSON.stringify(response.body)
  };
};

export const handle = MiddyMiddleware(UpdateCategory);