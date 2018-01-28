import { MessageEvent } from 'facebook-chat-api';

export default class Handler {
    public handle(message: MessageEvent): MessageEvent | Promise<MessageEvent> {
        return message;
    }
}
