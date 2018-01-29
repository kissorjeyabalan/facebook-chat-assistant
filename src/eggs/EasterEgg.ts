import { MessageEvent } from 'facebook-chat-api';

export default class EasterEgg {
    private regex: string;
    public egg(message: MessageEvent): Promise<any> {
        return Promise.resolve();
    }
}
