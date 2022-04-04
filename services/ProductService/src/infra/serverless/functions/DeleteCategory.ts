import "reflect-metadata";
import "../../../container";

import { DeleteCategoryController } from "../../../controllers/categories/DeleteCategoryController";
import { MiddyMiddleware } from "../utils/commonMiddleware";

const DeleteCategory = async (event: any) => {
  const deleteCategoryController = new DeleteCategoryController();

  const response = await deleteCategoryController.handle(event);

  return {
    statusCode: response.statusCode,
    body: JSON.stringify(response.body)
  };
};

export const handle = MiddyMiddleware(DeleteCategory);