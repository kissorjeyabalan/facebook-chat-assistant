import { Promise } from 'bluebird';
import {  MessageEvent, AttachmentMessage, MessageInfo } from 'facebook-chat-api';
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
    private submissions: Map<string, any> = new Map();
    private iu: ImageUtil = ImageUtil.getInstance();
    private r: snoowrap = Reddit.getInstance().getSnoo();
    private dirRoot: string = `${__dirname}/../..`;

    public isValid(args: string): boolean {
        const split = args.split(' ');

        return split.length === 1;
    }

    public run(msg: MessageEvent, sub: string): any {
        const api = Global.getInstance().getApi();

        this.r.getHot(sub, {limit: 25}).then(posts => {
            let items: any =  [];
            for (const post of posts) {
                if (this.iu.isImageUri(post) || ip.is_imgur(post.url)) {
                    const item = {title: post.title, url: post.url};
                    if (ip.is_imgur(post.url)) {
                        ip.purge(post.url, (err, res) => {
                            if (!err) {
                                item.url = res[0];
                            }
                        });
                    }
                    items.push(item);
                } else {
                    if (post.is_self) {
                        const item = {title: post.title, text: post.selftext};
                        items.push(item);
                    }
                }
            }

            return items;
        }).then(items => {
            const randItem = _.sample(items);
            if (randItem.hasOwnProperty('url')) {
                this.iu.saveImageFromUrl(randItem.url, 'temp', (err: Error, path: string) => {
                    if (!err) {
                        const imgMessage: AttachmentMessage = {
                            body: randItem.title,
                            attachment: fs.createReadStream(`${this.dirRoot}/media/${path}`),
                        };
                        api.sendMessage(imgMessage, msg.threadID, (err: any, mi: MessageInfo) => {
                            this.iu.deleteImageFromPath(path);
                        });
                    } else {
                        api.sendMessage('Something went wrong.', msg.threadID);
                    }
                });
            } else {
                api.sendMessage(randItem.title, msg.threadID);
                api.sendMessage(randItem.selftext, msg.threadID);
            }

            return;
        }).then(Promise.resolve);
    }

}
