import { Promise } from 'bluebird';
import { Api, AttachmentMessage, MessageEvent, MessageInfo } from 'facebook-chat-api';
import * as fs from 'fs';
import * as ip from 'impurge';
import * as _ from 'lodash';
import * as snoowrap from 'snoowrap';
import { Global } from '../../Global';
import { ImageUtil } from '../../util/ImageUtil';
import { Reddit } from '../../util/Reddit';
import EasterEgg from '../EasterEgg';
import { RepostHelper } from '../../db/helper/RepostHelper';
import { IRepost, Repost } from '../../db/model/Repost';

export default class RedditFetcher extends EasterEgg {
    protected regex: RegExp = /^(\br\b).*$/i;
    private iu: ImageUtil = ImageUtil.getInstance();
    private r: snoowrap = Reddit.getInstance().getSnoo();
    private dirRoot: string = `${__dirname}/../..`;


    public async weedReposts(posts: any, origSub: string, msg): Promise<any> {
        return new Promise(async resolve => {
        let items: any = [];
        let i = 0;
        for (const post of posts) {
            if (post.url == undefined) {
                post.url = '';
            }
            if (post.url.endsWith('gifv') || post.url.endsWith('webm')) {
                let newName = post.url;
                newName = post.url.slice(0, -4);
                newName = `${newName}mp4`;
                post.url = newName;
            }
            if (this.iu.isImageUri(post.url) || ip.is_imgur(post.url)) {
                let postTitle = post.title;
                if (origSub.toLowerCase() == 'casey') { postTitle = 'casey_irl'; }
                const item = { title: postTitle, url: post.url };
                if (ip.is_imgur(post.url)) {
                    ip.purge(post.url, (err, res) => {
                        if (!err) {
                            if (res[0].endsWith('.png') || res[0].endsWith('jpg') || res[0].endsWith('mp4') || res[0].endsWith('jpeg') || res[0].endsWith('gif')) {
                                item.url = res[0];
                            } else {
                                item.url = `${res[0]}.jpg`;
                            }
                        }
                    });
                }
                const isRepost = await RepostHelper.getInstance().isRepost(msg.threadID, post.url, post.url)
                if (!isRepost) {
                    items.push(item);
                }
            } else if (post.is_self) {
                if (post.selftext.split(' ').length < 45 && post.title.split(' ').length < 45) {
                    const item = { title: post.title, text: post.selftext };
                    const isRepost = await RepostHelper.getInstance().isRepost(msg.threadID, post.url, post.url)
                    if (!isRepost) {
                        items.push(item);
                    }
                }
            } else {
                const item = { title: post.title, other: post.url };
                const isRepost = await RepostHelper.getInstance().isRepost(msg.threadID, post.url, post.url)
                if (!isRepost) {
                    items.push(item);
                }
            }
            i++;
            if (i == posts.length) {
                resolve(items);
            }
        }
    });
    }

    public handleEgg(msg: MessageEvent): any {
        if (!this.isValid(msg.body)) {
            return;
        }

        const api = Global.getInstance().getApi();
        let sub: string = msg.body.split(' ')[1];
        const origSub = sub;
        if (sub.toLowerCase() == 'casey') {
            sub = 'me_irl+meirl+2meirl4meirl';
        }

        this.r.getHot(sub, { limit: 100 }).then(async posts => {
            let items = await this.weedReposts(posts, origSub, msg);
            return items;
        }).then(items => {
            if (items == null) {
                api.sendMessage(`/r/${sub} is empty.`, msg.threadID);
                return;
            }
            const randItem = _.sample(items);
            if (randItem.hasOwnProperty('url')) {
                this.iu.saveImageFromUrl(randItem.url, 'temp', (err: Error, path: string) => {
                    if (!err) {
                        let postTitle = randItem.title;
                        if (origSub == 'casey') { postTitle = 'casey_irl'; }
                        const imgMessage: AttachmentMessage = {
                            body: postTitle,
                            attachment: fs.createReadStream(`${this.dirRoot}/media/${path}`),
                        };
                        api.sendMessage(imgMessage, msg.threadID, (err: any, mi: MessageInfo) => {
                            this.iu.deleteImageFromPath(path);
                            RepostHelper.getInstance().setRepost(msg.threadID, randItem.url, randItem.url);
                        });
                    } else {
                        api.sendMessage(randItem.url, msg.threadID);
                        RepostHelper.getInstance().setRepost(msg.threadID, randItem.url, randItem.url);
                    }
                });
            } else if (randItem.hasOwnProperty('text')) {
                api.sendMessage(randItem.title, msg.threadID);
                setTimeout(() => {
                    api.sendMessage(randItem.text, msg.threadID);
                }, 666);
                RepostHelper.getInstance().setRepost(msg.threadID, randItem.text, randItem.text);
            } else {
                api.sendMessage(`${randItem.title}\n\n${randItem.other}`, msg.threadID);
                RepostHelper.getInstance().setRepost(msg.threadID, randItem.other, randItem.other);
            }

            return;
        }).then(Promise.resolve).catch(err => {
            if (err.hasOwnProperty('error') && err.error.hasOwnProperty('message') && err.error.hasOwnProperty('reason')) {
                api.sendMessage(`Message: ${err.error.message}\nReason: ${err.error.reason}`, msg.threadID);
            } else {
                api.sendMessage(`/r/${sub} does not exist or empty.`, msg.threadID);
            }
        });
    }

    private isValid(args: string): boolean {
        const split = args.split(' ');

        return split.length === 2;
    }
}
