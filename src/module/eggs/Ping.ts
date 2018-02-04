import { Promise } from 'bluebird';
import { Api, MessageEvent } from 'facebook-chat-api';
import { Global } from '../../Global';
import EasterEgg from '../EasterEgg';

export default class Ping extends EasterEgg {
    protected regex: RegExp = /^[ping]{4}$/i;

    public handleEgg(msg: MessageEvent): any {
        const api = Global.getInstance().getApi();

        let message = 'pong';
        for (let i = 0; i < msg.body.length; i += 1) {
            if (msg.body.charAt(i) === msg.body.charAt(i).toUpperCase()) {
                message = this.replaceAt(i, message, msg.body.charAt(i).toUpperCase());
            }
        }

        api.sendMessage(message, msg.threadID);

        return Promise.resolve(msg);
    }

    private replaceAt(i: number, text: string, char: string): string {
        const a = text.split('');
        a[i] = char;

        return a.join('');
    }

}
