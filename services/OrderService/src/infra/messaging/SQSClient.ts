import { SQS } from "aws-sdk";

export const sqsClient = new SQS({
  region: "sa-east-1",
  apiVersion: '2012-11-05'
});