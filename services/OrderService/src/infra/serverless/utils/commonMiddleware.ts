import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import cors from '@middy/http-cors';

export function MiddyMiddleware(handler: any) {
  return middy(handler)
    .use([
      httpJsonBodyParser(),
      httpEventNormalizer(),
      httpErrorHandler(),
      cors(),
    ]);
};