import { Promise } from 'bluebird';
import { Api, Error, MessageEvent } from 'facebook-chat-api';
import { Global } from '../../Global';
import EasterEgg from '../EasterEgg';

export default class SuicidePrevention extends EasterEgg {
    protected regex: RegExp = /(^(?=.*\bfeeling\b)(?=.*\bsuicidal\b).*$)|((?=.*\bkill(ing?)\b)(?=.*\bmyself\b).*$)/i;

    public handleEgg(msg: MessageEvent): any {
        const api = Global.getInstance().getApi();

        /*let message = 'If you are thinking about killing yourself, you may want to speak with someone...';
        message += '\n\nMental Helse: 116 123';
        message += '\nRøde Kors: 800 33 321';
        message += '\nKirkens SOS: 22 40 00 40';

        api.sendMessage(message, msg.threadID);*/

        api.setMessageReaction(':love:', msg.messageID, (err: Error) => {
            api.sendMessage('Me too buddy, me too...', msg.threadID);
        });

        return Promise.resolve(msg);
    }
}
