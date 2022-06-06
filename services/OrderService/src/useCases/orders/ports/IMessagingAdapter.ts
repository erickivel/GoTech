export interface IMessagingAdapter {
  sendMessage(message: string): Promise<void>;
};