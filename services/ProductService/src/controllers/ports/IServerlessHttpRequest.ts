export interface IServerlessHttpRequest {
  requestContext: {
    authorizer?: {
      user?: {
        id?: string
      },
    },
  },
  pathParameters?: any,
  body?: any;
};