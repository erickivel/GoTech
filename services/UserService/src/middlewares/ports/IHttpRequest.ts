export interface IHttpRequest {
  user?: {
    id: string;
  };
  headers: {
    authorization?: string;
  };
};