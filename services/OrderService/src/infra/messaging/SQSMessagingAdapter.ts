
import { IMessagingAdapter } from "../../useCases/orders/ports/IMessagingAdapter";
import { sqsClient } from "./SQSClient";

export class SQSMessagingAdapter implements IMessagingAdapter {
  async sendMessage(message: string): Promise<void> {
    try {
      await sqsClient.sendMessage({
        QueueUrl: process.env.SQS_URL || "sqsurl",
        MessageBody: message,
      }).promise();
    } catch (error) {
      console.error(error);
    }
  };
}