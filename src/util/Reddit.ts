import * as _ from 'lodash';
import * as snoowrap from 'snoowrap';
import { Configuration } from '../config/Configuration';

export class Reddit {
    private static instance: Reddit = new Reddit();
    private config: Configuration = Configuration.getInstance();
    private r: snoowrap;

    private constructor() {
        if (Reddit.instance) {
            throw new Error('Reddit already exists!');
        }
        const pkginfo = require('pkginfo')(module);
        this.r = new snoowrap({
            userAgent: `${this.config.fetch('bot.name.nick')}/${module.exports.version}`,
            clientId: `${this.config.fetch('reddit.client')}`,
            clientSecret: `${this.config.fetch('reddit.secret')}`,
            username: `${this.config.fetch('reddit.username')}`,
            password: `${this.config.fetch('reddit.password')}`,
        });
        Reddit.instance = this;
    }

    // tslint:disable-next-line:function-name
    public static getInstance(): Reddit {
        return Reddit.instance;
    }

    public getRandomSubmission(subreddit: string, callback?: (post: any) => void): Promise<any> {
        return this.r.getRandomSubmission(subreddit).then(post => {
            if (callback) {
                callback(post);
            }
        });
    }
}
