import { MessageEvent } from 'facebook-chat-api';
import Command from '../Command';
import { HelpDetails } from '../HelpDetails';

export default class TestCommand extends Command {
    public help: HelpDetails = new HelpDetails('test command', 'test', 'shortdesc', 'desc', 'syntax', 'example', false);

    public run(msg: MessageEvent, args: string): Promise<any> {
        console.log(`test: ${msg.body}`);

        return Promise.resolve(msg);
    }
}
