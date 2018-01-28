import { MessageEvent } from 'facebook-chat-api';
import { HelpDetails } from './HelpDetails';
export default class Command {
    public help: HelpDetails;

    public getHelp(): HelpDetails {
        return this.help;
    }

    public run(msg: MessageEvent, args: string): Promise<any> {
        return Promise.resolve();
    }
}
