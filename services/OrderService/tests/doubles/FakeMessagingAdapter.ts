import { IMessagingAdapter } from "../../src/useCases/orders/ports/IMessagingAdapter";

export class FakeMessagingAdapter implements IMessagingAdapter {
  async sendMessage(message: string): Promise<void> {
    return;
  };
}