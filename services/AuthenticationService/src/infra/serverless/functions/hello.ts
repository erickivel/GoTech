export const handle = async (event: any) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Hello Authentication Service',
        userId: event.requestContext.authorizer
      },
    ),
  }

  return response
};