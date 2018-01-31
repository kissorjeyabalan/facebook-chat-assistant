import { MessageEvent } from 'facebook-chat-api';

export default class EasterEgg {
    protected regex: RegExp;

    public handleEgg(message: MessageEvent): Promise<any> {
        return Promise.resolve();
    }

    public getRegex(): RegExp {
        return this.regex;
    }
}
