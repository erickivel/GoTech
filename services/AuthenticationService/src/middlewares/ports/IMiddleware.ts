import { IHttpRequest } from "./IHttpRequest";

export interface IMiddleware {
  handle(request: IHttpRequest): Promise<any>
};