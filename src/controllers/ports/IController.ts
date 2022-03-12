import { IHttpRequest } from "./IHttpRequest";
import { IHttpResponse } from "./IHttpResponse";

export interface IController {
  readonly requiredParams: string[];
  handle(request: IHttpRequest): Promise<IHttpResponse>;
}