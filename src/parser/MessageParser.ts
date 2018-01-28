import { MessageEvent } from 'facebook-chat-api';
import * as glob from 'glob';
import { Configuration } from '../config/Configuration';
import Handler from '../module/Handler';

export class MessageParser {
    private handlerInstances: any;
    private config: Configuration = Configuration.getInstance();

    public constructor() {
        const handlers = this.config.fetch('handlers');
        const classes =
            glob.sync('../module/handler/**/*.js', {cwd: __dirname})
            .map(cbfn => require(cbfn).default)
            .filter(e => e.prototype instanceof Handler)
            .filter(e => {
                const handler = e.prototype.constructor.name;
                if (handlers.indexOf(handler) === -1) {
                    console.info(`Handler ${handler} is disabled.`);

                    return false;
                }

                return true;
            })
            .map(e => {
                const temp = new e();
                console.info(`Handler ${temp.constructor.name} has been enabled.`);

                return temp;
            });

            this.handlerInstances = handlers.map(name => classes.find(i => i.constructor.name === name));
    }

    public handle(message: MessageEvent): Promise<any> {
        let promises = Promise.resolve(message);

        for (const handler of this.handlerInstances) {
            promises = promises.then(msg => handler.handle(msg));
        }

        return promises;
    }
}
