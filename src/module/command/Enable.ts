import { Promise } from 'bluebird';
import * as fb from 'facebook-chat-api';
import * as _ from 'lodash';
import { Configuration } from '../../config/Configuration';
import { Global } from '../../Global';
import Command from '../Command';
import { HelpDetails } from '../HelpDetails';

export default class Enable extends Command {
    public help: HelpDetails = new HelpDetails('Enabler', 'enable', 'Enable various features',
    'The purpose of this command is to enable various items that are disabled on a thread by default.',
    'enable <item>', '<no example>', true, true);
    private config: Configuration = Configuration.getInstance();

    public isValid(args: string): boolean {
        const split = args.toLowerCase().split(' ');

        return (split.length > 0) && (split[0] === 'to' ? split.length > 1 : split.length > 0);
    }

    public run(msg: fb.MessageEvent, args: string): any {
        const api = Global.getInstance().getApi();
        if (_.includes(this.config.fetch('bot.admin'), Number(msg.senderID))) {
            const split = args.toLowerCase().split(' ');
            // tslint:disable-next-line:switch-default
            switch (split[0] === 'to' ? split[1] : split[0]) {
                case 'cronjobs':
                    const subs = this.config.fetch('cronsubs');
                    subs.push(Number(msg.threadID));
                    this.config.add('cronsubs', subs);
                    api.sendMessage(`I've subscribed this thread to receive scheduled cronjobs in the future.`, msg.threadID);
            }
        }

        return Promise.resolve(msg);
    }

    private randomFileName(): string {
        // tslint:disable-next-line:insecure-random
        return Math.random().toString(36).substr(2, 5);
    }
}
