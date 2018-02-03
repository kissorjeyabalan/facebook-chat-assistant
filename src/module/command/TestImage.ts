import { Promise } from 'bluebird';
import * as fb from 'facebook-chat-api';
import * as fs from 'fs';
import * as request from 'request';
import * as stream from 'stream';
import { Global } from '../../Global';
import { ImageUtil } from '../../util/ImageUtil';
import Command from '../Command';
import { HelpDetails } from '../HelpDetails';

export default class TestImage extends Command {
    public help: HelpDetails = new HelpDetails('Test Image', 'imagetest', 'Test image URI',
    'Attempts to convert URI to image.',
    'testimage <uri>', 'testimage https://...', true, true);
    private dirRoot: string = `${__dirname}/../..`;

    public isValid(args: string): boolean {
        const split = args.split(' ');

        return split.length === 1;
    }

    public run(msg: fb.MessageEvent, uri: string): any {
        const api = Global.getInstance().getApi();
        const imgUtil: ImageUtil = ImageUtil.getInstance();

        imgUtil.saveImageFromUrl(uri, 'temp', (err: Error, path: string) => {
            if (!err) {
                const attachMsg: fb.AttachmentMessage = {
                    body: '',
                    attachment: fs.createReadStream(`${this.dirRoot}/media/${path}`),
                };

                return api.sendMessage(attachMsg, msg.threadID, (err, mi) => {
                    imgUtil.deleteImageFromPath(path);
                });
            } else {
                console.log(err);

                return msg;
            }
        });
    }

    private randomFileName(): string {
        // tslint:disable-next-line:insecure-random
        return Math.random().toString(36).substr(2, 5);
    }
}
