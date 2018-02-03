import { Promise } from 'bluebird';
import { MessageEvent } from 'facebook-chat-api';
import * as glob from 'glob';
import { Configuration } from '../../config/Configuration';
import { Global } from '../../Global';
import EasterEgg from '../EasterEgg';
import Handler from '../Handler';

export default class EasterEggHandler extends Handler {

    private eggs: Map<RegExp, EasterEgg>;

    private constructor() {
        super();
        this.eggs = new Map();
        const enabledEggs = Configuration.getInstance().fetch('eggs');

        glob.sync('../eggs/**/*.js', {cwd: __dirname})
        .map(cbfn => require(cbfn).default)
        .filter(e => e.prototype instanceof EasterEgg)
        .filter(e => {
            if (enabledEggs.indexOf(e.prototype.constructor.name) === -1) {
                console.info(`Easter egg ${e.prototype.constructor.name} is disabled.`);

                return false;
            }

            return true;
        })
        .map(e => {
            const instance: EasterEgg = new e();
            this.eggs.set(instance.getRegex(), instance);
            console.info(`Easter egg ${e.prototype.constructor.name} has been enabled.`);
        });
    }

    public handle(message: MessageEvent): any {
        for (const [regex, egg] of this.eggs) {
            if (regex.test(message.body)) {
                const api = Global.getInstance().getApi();
                setTimeout(() => api.markAsRead(message.threadID), 333);
                const endTyping = api.sendTypingIndicator(message.threadID);
                new Promise(resolve => resolve(egg.handleEgg(message)))
                    .catch(err => console.error(err))
                    .finally(endTyping());
            }
        }
    }
}
