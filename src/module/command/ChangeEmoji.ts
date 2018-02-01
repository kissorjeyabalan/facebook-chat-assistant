import { Error, MessageEvent } from 'facebook-chat-api';
import { Global } from '../../Global';
import Command from '../Command';
import { HelpDetails } from '../HelpDetails';

export default class ChangeEmoji extends Command {
    public help: HelpDetails = new HelpDetails('Change Emoji', 'emoji', 'Change thread emoji',
    'Changes the thread emoji to any emoji.\n\nNote: Not all emoji plays nice with the UI.',
    'emoji <emoji>', 'emoji \u{1f60f}', false, false);

    public isValid(args: string): boolean {
        const split = args.split(' ');

        return split.length === 1 && split[0].length === 2;
    }

    public run(msg: MessageEvent, emoji: string): Promise<any> {
        const api = Global.getInstance().getApi();
        api.changeThreadEmoji(emoji, msg.threadID, (err: Error) => {
            if (err) {
                console.error(err);
                api.sendMessage(`I wasn't able to change the emoji :(`, msg.threadID);
            } else {
                api.sendMessage(`I set the emoji to ${emoji} as you requested :)`, msg.threadID);
            }
        });

        return Promise.resolve(msg);
    }

}
