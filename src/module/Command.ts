import { MessageEvent } from 'facebook-chat-api';
import { HelpDetails } from './HelpDetails';
export default class Command {
    public help: HelpDetails;
    private valid: boolean;

    public getHelp(): HelpDetails {
        return this.help;
    }

    public run(msg: MessageEvent, args: string): Promise<any> {
        return Promise.resolve();
    }

    public isValid(args: string): boolean {
        return false;
    }
}
