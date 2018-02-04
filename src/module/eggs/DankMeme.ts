import { Promise } from 'bluebird';
import * as fb from 'facebook-chat-api';
import * as fs from 'fs';
import * as ip from 'impurge';
import * as _ from 'lodash';
import * as snoowrap from 'snoowrap';
import { Global } from '../../Global';
import { ImageUtil } from '../../util/ImageUtil';
import { Reddit } from '../../util/Reddit';
import EasterEgg from '../EasterEgg';

export default class DankMeme extends EasterEgg {
    protected regex: RegExp = /(^(?=.*\bdank\b)(?=.*\bmeme([s]?)\b).*$)|(^(?=.*\bmeme([s]?\b))(?=.*\bme\b).*$)/i;
    private dirRoot: string = `${__dirname}/../..`;
    private links: any = [];
    private iu: ImageUtil = ImageUtil.getInstance();
    private r: snoowrap = Reddit.getInstance().getSnoo();

    public handleEgg(msg: fb.MessageEvent): any {
        const api = Global.getInstance().getApi();

        if (this.links.length === 0) {
            this.r.getTop('dankmemes', {time: 'day', limit: 50}).then(posts => {
                for (const post of posts) {
                    if (this.isImageUri(post.url) || ip.is_imgur(post.url)) {
                        let item = {title: post.title, url: post.url};
                        if (ip.is_imgur(post.url)) {
                            ip.purge(post.url, (err, res) => {
                                if (!err) {
                                    item.url = res[0];
                                } else {
                                    return;
                                }
                            });
                        }
                        this.links.push(item);
                    }
                }

                return;
            }).then(() => {
                this.handleEgg(msg);
            });
        } else {
            // tslint:disable-next-line:underscore-consistent-invocation
            const link = _.sample(this.links);

            this.iu.saveImageFromUrl(link.url, 'temp', (err: Error, path: string) => {
                if (!err) {
                    const memeMsg: fb.AttachmentMessage = {
                        body: link.title,
                        attachment: fs.createReadStream(`${this.dirRoot}/media/${path}`),
                    };
                    api.sendMessage(memeMsg, msg.threadID, (err: fb.Error, mi: fb.MessageInfo) => {
                        this.iu.deleteImageFromPath(path);
                        _.pull(this.links, link);
                    });
                } else {
                    this.handleEgg(msg);
                }
            });
        }

        return Promise.resolve(msg);
    }

    private isImageUri(uri: string) {
        const end = /(?:([^:/?#]+):)?(?:\/\/([^/?#]*))?([^?#]*\.(?:jpg|jpeg|gif|png))(?:\?([^#]*))?(?:#(.*))?/i;

        return end.test(uri);
    }

}
