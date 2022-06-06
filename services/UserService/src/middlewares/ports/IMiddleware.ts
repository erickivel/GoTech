import { IHttpRequest } from "./IHttpRequest";
import { IHttpResponse } from "./IHttpResponse";

export interface IMiddleware {
  handle(request: IHttpRequest): Promise<IHttpResponse | any>
};