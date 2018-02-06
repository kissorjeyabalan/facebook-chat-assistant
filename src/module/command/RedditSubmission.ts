import { Promise } from 'bluebird';
import { MessageEvent, AttachmentMessage, MessageInfo } from 'facebook-chat-api';
import * as fs from 'fs';
import * as ip from 'impurge';
import * as snoowrap from 'snoowrap';
import { Global } from '../../Global';
import { ImageUtil } from '../../util/ImageUtil';
import { Reddit } from '../../util/Reddit';
import Command from '../Command';
import { HelpDetails } from '../HelpDetails';
import * as _ from 'lodash';

export default class RedditSubmission extends Command {
    public help: HelpDetails = new HelpDetails('Random Reddit Submission', 'reddit', 'Get random submission',
    'Gets a random image or text submission from the specified subreddit.',
    'reddit <subreddit>', 'reddit meirl', false, false);
    private submissions: Map<string, any>;
    private iu: ImageUtil = ImageUtil.getInstance();
    private r: snoowrap = Reddit.getInstance().getSnoo();
    private dirRoot: string = `${__dirname}/../..`;

    public isValid(args: string): boolean {
        const split = args.split(' ');

        return split.length === 1;
    }

    public run(msg: MessageEvent, sub: string): any {
        const api = Global.getInstance().getApi();

        if (this.submissions.get(sub) === undefined) {
            this.submissions.set(sub, []);
        }

        if (this.submissions.get(sub).length === 0) {
            this.r.getHot(sub, {limit: 25}).then(posts => {
                for (const post of posts) {
                    if (this.iu.isImageUri(post) || ip.is_imgur(post.url)) {
                        const item = {title: post.title, url: post.url};
                        if (ip.is_imgur) {
                            ip.purge(post.url, (err, res) => {
                                if (!err) {
                                    item.url = res[0];
                                }
                            });
                        }
                        const arr = this.submissions.get(sub);
                        arr.push(item);
                        this.submissions.set(sub, arr);
                    } else {
                        if (post.is_self) {
                            const item = {title: post.title, text: post.selftext};
                            const arr = this.submissions.get(sub);
                            arr.push(item);
                            this.submissions.set(sub, arr);
                        }
                    }
                }
            }).then(this.run(msg, sub));
        }

        // tslint:disable-next-line:underscore-consistent-invocation
        const item = _.sample(this.submissions.get(sub));

        if (item.hasOwnProperty('url')) {
            this.iu.saveImageFromUrl(item.url, 'temp', (err: Error, path: string) => {
                if (!err) {
                    const imgMessage: AttachmentMessage = {
                        body: item.title,
                        attachment: fs.createReadStream(`${this.dirRoot}/media/${path}`),
                    };
                    api.sendMessage(imgMessage, msg.threadID, (err: any, mi: MessageInfo) => {
                        this.iu.deleteImageFromPath(path);
                        const arr = this.submissions.get(sub);
                        _.pull(arr, item);
                        this.submissions.set(sub, arr);
                    });
                } else {
                    this.run(msg, sub);
                }
            });
        } else {
            api.sendMessage(item.title, msg.threadID);
            api.sendMessage(item.selftext, msg.threadID);
            const arr = this.submissions.get(sub);
            _.pull(arr, item);
            this.submissions.set(sub, arr);
        }

        return Promise.resolve(msg);
    }

}
