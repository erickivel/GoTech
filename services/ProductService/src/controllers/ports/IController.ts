import { IHttpRequest } from "./IHttpRequest";
import { IHttpResponse } from "./IHttpResponse";
import { IServerlessHttpRequest } from "./IServerlessHttpRequest";

export interface IController {
  readonly requiredParams?: string[];
  handle(request: IHttpRequest | IServerlessHttpRequest): Promise<IHttpResponse>;
}