import * as glob from 'glob';
import { Configuration } from '../config/Configuration';
import Handler from '../handler/Handler';

export class MessageParser {
    private handlerInstances: any;
    private config: Configuration = Configuration.getInstance();

    public init(): void {
        const handlers = this.config.fetch('handlers');
        const classes =
            glob.sync('../handler/**/*.js', {cwd: __dirname})
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

    public async handle(message: string) {
        let promises = Promise.resolve(message);

        for (const handler of this.handlerInstances) {
            promises = promises.then(msg => handler.handle(msg));
        }

        return promises;
    }
}
