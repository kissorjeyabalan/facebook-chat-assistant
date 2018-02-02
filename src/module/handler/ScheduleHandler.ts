import * as fb from 'facebook-chat-api';
import * as glob from 'glob';
import { Configuration } from '../../config/Configuration';
import Handler from '../Handler';
import Schedule from '../Schedule';

export default class ScheduleHandler extends Handler {
    private api: fb.Api;
    private cronInstances: Schedule[];

    public constructor() {
        super();
        const enabledCrons = Configuration.getInstance().fetch('crons');
        const cronJobs =
            glob.sync('../schedule/**/*.js', {cwd: __dirname})
            .map(cbfn => require(cbfn).default)
            .filter(e => e.prototype instanceof Schedule)
            .filter(e => {
                const name = e.prototype.constructor.name;
                if (enabledCrons.indexOf(name) === 1) {
                    console.info(`Cronjob ${name} is disabled.`);

                    return false;
                }

                return true;
            })
            .map(e => {
                const cron = new e();
                console.info(`Cronjob ${name} enabled.`);

                return cron;
            });

            this.cronInstances = enabledCrons.map(name => cronJobs.find(i => i.prototype.constructor.name));
    }

    public start(): void {
        for (const cronJob of this.cronInstances) {
            cronJob.start();
        }
    }
}
