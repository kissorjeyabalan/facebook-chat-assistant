import { MessageEvent } from 'facebook-chat-api';
import * as glob from 'glob';
import { Configuration } from '../../config/Configuration';
import EasterEgg from '../EasterEgg';
import Handler from '../Handler';

export default class EasterEggHandler extends Handler {

    private eggs: Map<string, EasterEgg>;

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
            this.eggs.set(instance.getEgg(), instance);
            console.info(`Easter egg ${e.constructor.name} has been enabled.`);
        });
    }

    public async handle(message: MessageEvent): Promise<any> {
        for (const [regex, egg] of this.eggs) {
            if (message.body.match(regex)) {
                egg.handleEgg(message);
                break;
            }
        }
    }
}