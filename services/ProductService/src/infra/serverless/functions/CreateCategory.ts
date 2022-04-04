import "reflect-metadata";
import "../../../container";

import { CreateCategoryController } from "../../../controllers/categories/CreateCategoryController";
import { MiddyMiddleware } from "../utils/commonMiddleware";

const CreateCategory = async (event: any) => {
  console.log(event);

  const createCategoryController = new CreateCategoryController();

  const response = await createCategoryController.handle(event);


  console.log(response);

  return {
    statusCode: response.statusCode,
    body: JSON.stringify(response.body)
  };
};

export const handle = MiddyMiddleware(CreateCategory);