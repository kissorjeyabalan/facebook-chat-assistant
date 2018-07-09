import * as fb from 'facebook-chat-api';
import * as mongoose from 'mongoose';
import { Configuration } from '../../config/Configuration';
import { Global } from '../../Global';
import * as repost from '../model/Repost';

export class RepostHelper {
    private static instance: RepostHelper = new RepostHelper();
    private config: Configuration = Configuration.getInstance();
    private global: Global = Global.getInstance();

    private constructor() {
        if (RepostHelper.instance) {
            throw Error('Error: RepostHelper already exists.');
        }
        RepostHelper.instance = this;
    }

    // tslint:disable-next-line:function-name
    public static getInstance() {
        return RepostHelper.instance;
    }

    public isRepost(chatId: string, postUrl: string, postName: string) : Promise<boolean> {
        return new Promise((resolve) => {
            repost.Repost.findOne({chatid: chatId, posturl: postUrl, post: postName}, (err, obj) => {
                if (err) {
                    console.log("resolving false from error");
                    resolve(false);
                } else if (obj !== undefined) {
                    console.log("resolving true because object not null");
                    resolve(true);
                } else {
                    console.log("resolving false for no reason");
                    resolve(false);
                }
            }); 
        });
    }

    public setRepost(chatId: string, postUrl: string, postName: string) {
        const options: mongoose.ModelFindOneAndUpdateOptions = {
            upsert: true,
            new: true,
        };
        const insItem: repost.IRepost = {
            chatid: chatId,
            post: postName,
            posturl: postUrl
        };
        repost.Repost.findOneAndUpdate({chatid: chatId, posturl: postUrl, post: postName}, insItem, options);
    }
}
