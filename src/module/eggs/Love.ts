import { Promise } from 'bluebird';
import { Api, Error, MessageEvent } from 'facebook-chat-api';
import { Global } from '../../Global';
import EasterEgg from '../EasterEgg';

export default class Love extends EasterEgg {
    protected regex: RegExp = /(kill me)|(me too(?:,) thanks)|(fuck life)/i;

    public handleEgg(msg: MessageEvent): any {
        const api = Global.getInstance().getApi();


        api.setMessageReaction(':love:', msg.messageID);

        return Promise.resolve(msg);
    }
}
