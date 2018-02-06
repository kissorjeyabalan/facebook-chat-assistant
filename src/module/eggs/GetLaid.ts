import { Promise } from 'bluebird';
import * as fb from 'facebook-chat-api';
import * as fs from 'fs';
import * as ip from 'impurge';
import * as _ from 'lodash';
import * as snoowrap from 'snoowrap';
import { Global } from '../../Global';
import { Reddit } from '../../util/Reddit';
import EasterEgg from '../EasterEgg';

export default class DankMeme extends EasterEgg {
    protected regex: RegExp = /(how do i get laid)|(dating advice)/i;
    private dirRoot: string = `${__dirname}/../..`;
    private links: any = [];
    private r: snoowrap = Reddit.getInstance().getSnoo();

    public handleEgg(msg: fb.MessageEvent): any {
        const api = Global.getInstance().getApi();

        if (this.links.length === 0) {
            this.r.getTop('shittyseduction', {time: 'all', limit: 100}).then(posts => {
                for (const post of posts) {
                    const item = {title: post.title, text: post.selftext};
                    this.links.push(item);
                }

                return;
            }).then(() => {
                this.handleEgg(msg);
            });
        } else {
            // tslint:disable-next-line:underscore-consistent-invocation
            const link = _.sample(this.links);

            api.sendMessage(`${link.title}\n\n${link.text}`, msg.threadID);
            _.pull(this.links, link);
        }

        return Promise.resolve(msg);
    }
}
