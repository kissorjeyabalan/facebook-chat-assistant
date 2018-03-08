import { Promise } from 'bluebird';
import { Api, Error, MessageEvent, UserInfo } from 'facebook-chat-api';
import * as glob from 'glob';
import * as _ from 'lodash';
import { Configuration } from '../../config/Configuration';
import { UserHelper } from '../../db/helper/UserHelper';
import { Global } from '../../Global';
import Command from '../Command';
import Handler from '../Handler';
import { HelpDetails } from '../HelpDetails';

export default class CommandHandler extends Handler {
    private trigger: string;
    private commandInstances: Map<string, Command>;
    private uh: UserHelper = UserHelper.getInstance();

    private constructor() {
        super();
        this.trigger = Configuration.getInstance().fetch('bot.trigger');

        this.commandInstances = new Map();
        glob.sync('../command/**/*.js', {cwd: __dirname})
        .map(cbfn => require(cbfn).default)
        .filter(e => e.prototype instanceof Command)
        .map(e => {
            if (!Configuration.getInstance().isCmdEnabled(e.prototype.constructor.name.split(' ').join(''))) {
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

    public handle(message: MessageEvent): any {
        const global = Global.getInstance();
        const api = global.getApi();

        if (!this.isCmd(message)) {
            return message;
        }

        setTimeout(() => api.markAsRead(message.threadID), 333);

        const cmd = this.getMsgCmd(message);
        const args = this.getCmdArgs(message);

        if (cmd === 'help') {
            api.sendMessage(this.printHelp(args), message.threadID);

            return message;
        }

        const cmdInstance = this.commandInstances.get(cmd);

        if (cmdInstance === undefined) {
            //console.log(`Module for ${cmd} does not exist. Ignoring request.`);
            return message;
        }

        if (cmdInstance.getHelp().isAdminOnly()) {
            if (!_.includes(Configuration.getInstance().fetch('bot.admin'), Number(message.senderID))) {
                this.uh.getFirstName(message.senderID, (err: Error, data: UserInfo) => {
                    api.sendMessage(`${data.firstName} is not in the sudoers file. This incident will be reported.`, message.threadID);
                });

                return message;
            }
        }

        if (!cmdInstance.isValid(args)) {
            api.sendMessage(`\u{274c} Invalid syntax!\n\nUsage: \n${cmdInstance.getHelp().getSyntax()}`, message.threadID);

            return message;
        } else {
            const endTyping = api.sendTypingIndicator(message.threadID);

            new Promise(resolve => resolve(cmdInstance.run(message, args)))
                .catch(err => console.error(err))
                .finally(endTyping());

            return message;
        }
    }

    private isCmd(message: MessageEvent) {
        return message.body.toLowerCase() && message.body.toLowerCase().startsWith(this.trigger.toLowerCase());
    }

    private getMsgCmd(message: MessageEvent) {
        return message.body.split(this.trigger.toLowerCase())[1].split(' ')[1].toLowerCase();
    }

    private getCmdArgs(message: MessageEvent) {
        return message.body.toLowerCase().substring(this.trigger.length + this.getMsgCmd(message).length + 1).trim();
    }

    private printHelp(cmd?: string) {
        let help: string;
        if (cmd.length === 0) {
            help = '\u{1f481} Available commands:\n\n';
            this.commandInstances.forEach((instance, command) => {
                if (instance.getHelp().isHidden()) {
                    return;
                }
                help += `${instance.getHelp().getCmd()} — ${instance.getHelp().getShortDescription()}\n`;
            });
            help += '\nhelp <cmd> — more info';

            return help;
        }

        if (this.commandInstances.get(cmd.split(' ')[0]) === undefined) {
            help = `'${cmd.split(' ')[0]}' is not a valid command.`;
        } else {
            const details: HelpDetails = this.commandInstances.get(cmd.split(' ')[0]).getHelp();
            help = `\u{2139} ${details.getName()}:`;
            help += `\n${details.getDescription()}`;
            help += `\n\nSyntax: \n${details.getSyntax()}`;
            help += `\n\nExample: \n${details.getExample()}`;
            help += details.isAdminOnly() ? '\n\n(Requires admin privileges)' : '';
        }

        return help;
    }

}
