export const handle = (event: any, context: any) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Hello Authentication Service',
        userId: event.requestContext.authorizer
      },
    ),
  }

  return new Promise((resolve) => {
    resolve(response)
  });
};