import { verify } from 'jsonwebtoken';

type Payload = {
  sub: string;
};

export const handle = async (event: any) => {
  if (!event.headers.authorization) {
    return {
      "isAuthorized": false,
    };
  };

  const authHeader = event.headers.authorization;

  const [, token] = authHeader.split(" ");

  try {
    const { sub } = verify(token, process.env.TOKEN_SECRET_KEY || "secretKey") as Payload;

    return {
      "isAuthorized": true,
      "context": {
        "user": {
          "id": sub
        },
      },
    }
  } catch (error) {
    console.log(error);
    return {
      "isAuthorized": false,
    }
  }
}