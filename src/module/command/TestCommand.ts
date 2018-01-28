import { MessageEvent } from 'facebook-chat-api';
import Command from '../Command';
import { HelpDetails } from '../HelpDetails';

export default class TestCommand extends Command {
    public help: HelpDetails = new HelpDetails('command name', 'detail', 'shortdesc', 'desc', 'syntax', 'example', false);

    public run(msg: MessageEvent, args: string): Promise<any> {
        console.log(`message; ${msg.body}`);

        return Promise.resolve(msg);
    }
}
