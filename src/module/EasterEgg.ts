import { MessageEvent } from 'facebook-chat-api';

export default class EasterEgg {
    private regex: string;

    public handleEgg(message: MessageEvent): Promise<any> {
        return Promise.resolve();
    }

    public getEgg(): string {
        return this.regex;
    }
}
