import * as fb from 'facebook-chat-api';
import * as glob from 'glob';
import { Configuration } from '../../config/Configuration';
import Handler from '../Handler';
import Schedule from '../Schedule';

export default class ScheduleHandler extends Handler {
    private api: fb.Api;
    private cronInstances: any;

    public constructor() {
        super();
        const enabledCrons = Configuration.getInstance().fetch('crons');
        const cronJobs =
            glob.sync('../schedule/**/*.js', {cwd: __dirname})
            .map(cbfn => require(cbfn).default)
            .filter(e => e.prototype instanceof Schedule)
            .filter(e => {
                const scheduleName = e.prototype.constructor.name;
                if (enabledCrons.indexOf(scheduleName) === -1) {
                    console.info(`Handler ${scheduleName} is disabled.`);

                    return false;
                }

                return true;
            })
            .map(e => {
                const temp = new e();
                console.info(`Cronjob ${temp.constructor.name} has been enabled.`);

                return temp;
            });

            this.cronInstances = enabledCrons.map(name => cronJobs.find(i => i.constructor.name === name));
    }

    public start(): void {
        for (const cronJob of this.cronInstances) {
            cronJob.start();
        }
    }
}
