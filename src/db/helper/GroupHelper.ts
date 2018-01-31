import { MessageEvent } from 'facebook-chat-api';
import * as mongoose from 'mongoose';
import { Configuration } from '../../config/Configuration';
import { Global } from '../../Global';
import * as gi from '../model/GroupInfo';
import * as sm from '../model/SavedMessage';

export class GroupHelper {
    private static instance: GroupHelper = new GroupHelper();
    private config: Configuration = Configuration.getInstance();
    private global: Global = Global.getInstance();

    private constructor() {
        if (GroupHelper.instance) {
            throw Error('Error: GroupInfo already exists.');
        }
        GroupHelper.instance = this;
    }

    // tslint:disable-next-line:function-name
    public static getInstance() {
        return GroupHelper.instance;
    }

    public getGroupInfo(threadIDz: string, callback?: (err: Error, info: gi.IGroupInfo) => void): void {
        console.log('getGroupInfo called.');
        gi.GroupInfo.findOne({threadID: threadIDz}, (err, obj) => {
            if (err) {
                callback(new Error('Query Error'), undefined);
            } else if (obj !== null) {
                callback(undefined, obj);
            } else {
                callback(undefined, undefined);
            }
        });
    }

    public updateGroupInfo(message: MessageEvent, callback?: () => void): void {
        console.log('Update group received message.');
        this.getGroupInfo(message.threadID, (err: Error, info: gi.IGroupInfo) => {
            if (!err) {
                let newThread = false;
                if (!info) {
                    newThread = true;
                    const msg = `Hello, earthlings! My name is ${this.config.fetch('bot.name.full')}, ` +
                                `but you can call me ${this.config.fetch('bot.name.nick')}.` +
                                `\n\nPlease give me a few seconds so I can collect some information` +
                                `about this chat before you use any commands.`;
                    this.global.getApi().sendMessage(msg, message.threadID);
                }
            }
        });
    }
}
