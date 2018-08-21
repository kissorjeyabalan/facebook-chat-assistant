import { Error, MessageEvent } from 'facebook-chat-api';
import { Global } from '../../Global';
import Command from '../Command';
import { HelpDetails } from '../HelpDetails';

export default class ChangeEmoji extends Command {
    public help: HelpDetails = new HelpDetails('PSA', 'psa', 'PSA',
    'Sends a Public Service Announcement to all conversations the bot is a part of.',
    'psa <message>', 'psa you have been warned', false, false);

    public isValid(args: string): boolean {
        const split = args.split(' ');
        return split.length > 0;
    }

    public run(msg: MessageEvent, psa: string): Promise<any> {
	const api = Global.getInstance().getApi();
        api.sendMessage(`PSA: ${msg.body.substring(5).trim()}`, '1420517794899222');
        return Promise.resolve(msg);
    }

}
