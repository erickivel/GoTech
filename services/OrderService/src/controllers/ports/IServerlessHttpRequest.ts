export interface IServerlessHttpRequest {
  requestContext: {
    authorizer?: {
      user?: {
        id: string,
        name: string
        email: string
      },
    },
  },
  pathParameters?: any,
  body?: any;
};