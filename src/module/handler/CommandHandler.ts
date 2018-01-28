import { Api, MessageEvent } from 'facebook-chat-api';
import * as glob from 'glob';
import { Configuration } from '../../config/Configuration';
import { Global } from '../../Global';
import Command from '../Command';
import Handler from '../Handler';

export default class CommandHandler extends Handler {
    private trigger: string;
    private api: Api;
    private commandInstances: Map<string, Command>;

    private constructor() {
        super();
        this.trigger = Configuration.getInstance().fetch('bot.trigger');
        this.api = Global.getInstance().getApi();

        this.commandInstances = new Map();
        glob.sync('../command/**/*.js', {cwd: __dirname})
        .map(cbfn => require(cbfn).default)
        .filter(e => e.prototype instanceof Command)
        .map(e => {
            if (!Configuration.getInstance().isCmdEnabled(e.prototype.constructor.name)) {
                console.info(`Command ${e.prototype.constructor.name} is not enabled.`);

                return undefined;
            }

            return new e();
        })
        .filter(instance => instance !== undefined)
        .forEach((instance: Command) => {
            this.commandInstances.set(instance.getHelp().getCmd().toLowerCase(), instance);
            console.log(`Command ${instance.getHelp().getName()} has been enabled.`);
        });
    }

    public handle(message: MessageEvent): MessageEvent | Promise<MessageEvent> {
        if (!this.isCmd(message)) {
            return message;
        }

        const cmd = this.getMsgCmd(message);
        const args = this.getCmdArgs(message);

        if (cmd === 'help') {
            // TODO: Print help
        }

        const cmdInstance = this.commandInstances.get(cmd);
        if (cmdInstance === undefined) {
            console.log(`Module for ${cmd} does not exist. Ignoring request.`);

            return message;
        }

        // TODO: Check if syntax is valid
        cmdInstance.run(message, args).catch(err => console.warn(err));

        return message;
    }

    private isCmd(message: MessageEvent) {
        return message.body.toLowerCase() && message.body.startsWith(this.trigger.toLowerCase());
    }

    private getMsgCmd(message: MessageEvent) {
        return message.body.split(this.trigger.toLowerCase())[1].split(' ')[1].toLowerCase();
    }

    private getCmdArgs(message: MessageEvent) {
        return message.body.substring(this.trigger.length + this.getMsgCmd(message).length + 1).trim();
    }
}
