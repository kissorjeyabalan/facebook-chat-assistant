import * as fb from 'facebook-chat-api';
import * as fs from 'fs';
import * as ns from 'node-schedule';
import { Configuration } from '../../config/Configuration';
import { Global } from '../../Global';
import { ImageUtil } from '../../util/ImageUtil';
import { Reddit } from '../../util/Reddit';
import Schedule from '../Schedule';

export default class WednesdayFrog extends Schedule {
    private dirRoot: string = `${__dirname}/../..`;
    public start(): void {
        const r: Reddit = Reddit.getInstance();
        const iu: ImageUtil = ImageUtil.getInstance();
        const config: Configuration = Configuration.getInstance();

        const cron = ns.scheduleJob('6 12 * * 3', (fireDate) => {
            const api: fb.Api = Global.getInstance().getApi();

            r.getRandomSubmission('ItIsWednesday', (post) => {
                iu.saveImageFromUrl(post.url, 'temp', (err: Error, path: string) => {
                    if (!err) {
                        const wfAttach: fb.AttachmentMessage = {
                            body: '',
                            attachment: fs.createReadStream(`${this.dirRoot}/media/${path}`),
                        };
                        for (const sub of config.fetch('cronsubs')) {
                            api.sendMessage(wfAttach, sub);
                        }
                        iu.deleteImageFromPath(path);
                    } else {
                        for (const sub of config.fetch('cronsubs')) {
                            api.sendMessage(`It's wednesday my dudes! I tried to get one of them memes, but instead I got told that ${err.message}`, sub);
                        }
                    }
                });
            });
        });
    }
}
