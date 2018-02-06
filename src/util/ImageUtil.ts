import * as fs from 'fs';
import * as _ from 'lodash';
import * as request from 'request';
import * as stream from 'stream';
import { Configuration } from '../config/Configuration';

export class ImageUtil {
    private static instance: ImageUtil = new ImageUtil();
    private imgTypes: string[] = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'video/mp4'];
    private dirRoot: string = `${__dirname}/..`;
    private pkginfo: any = require('pkginfo')(module);

    private constructor() {
        if (ImageUtil.instance) {
            throw new Error('ImageUtil already exists!');
        }
        ImageUtil.instance = this;
    }

    // tslint:disable-next-line:function-name
    public static getInstance(): ImageUtil {
        return ImageUtil.instance;
    }

    public async saveImageFromUrl(uri: string, folder: string, callback: (err: Error, path: string) => void) {
        const options: request.OptionsWithUri = {
            method: 'GET',
            uri: uri,
            headers: {
                'User-Agent': `${Configuration.getInstance().fetch('bot.name.nick')}/${module.exports.version}`,
            },
            encoding: null,
        };

        request(options)
            .on('error', (err) => {
                callback(err, undefined);
            })
            .on('response', (res) => {
                if (_.includes(this.imgTypes, res.headers['content-type'])) {
                    const randName = `${this.randomFileName()}.${res.headers['content-type'].split('/')[1]}`;
                    res.pipe(fs.createWriteStream(`${this.dirRoot}/media/${folder}/${randName}`))
                        .on('close', (err, data) => {
                            if (err) {
                                console.error(err);
                                callback(err, undefined);
                            } else {
                                callback(undefined, `${folder}/${randName}`);
                            }
                        });
                } else {
                    callback(new Error('URI is not an image.'), undefined);
                }
            });
    }

    public deleteImageFromPath(path: string): void {
        fs.unlink(`${this.dirRoot}/media/${path}`, (err) => {
            if (err) {
                console.error(err);
            }
        });
    }

    public isImageUri(uri: string) {
        const end = /(?:([^:/?#]+):)?(?:\/\/([^/?#]*))?([^?#]*\.(?:jpg|jpeg|gif|png))(?:\?([^#]*))?(?:#(.*))?/i;

        return end.test(uri);
    }

    private randomFileName(): string {
        // tslint:disable-next-line:insecure-random
        return Math.random().toString(36).substr(2, 5);
    }
}
