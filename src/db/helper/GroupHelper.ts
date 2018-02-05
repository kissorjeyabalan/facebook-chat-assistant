import * as fb from 'facebook-chat-api';
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

    public getGroupInfo(threadID: string, callback?: (err: Error, info: gi.IGroupInfo) => void): void {
        gi.GroupInfo.findOne({threadID: threadID}, (err, obj) => {
            if (err) {
                callback(new Error('Query Error'), undefined);
            } else if (obj !== null) {
                console.log('found a group');
                callback(undefined, obj);
            } else {
                callback(undefined, undefined);
            }
        }).lean();
    }

    public updateGroupInfo(message: fb.MessageEvent, callback?: (err: fb.Error, thread?: gi.IGroupInfo) => void) {
        console.log('attempting to update group info');
        this.getGroupInfo(message.threadID, (err: Error, info: gi.IGroupInfo) => {
            const api = Global.getInstance().getApi();
            let newThread = false;
            console.log('getting group');
            if (!info) {
                console.log('group is new');
                newThread = true;
                const msg = `Hello, earthlings! My name is ${this.config.fetch('bot.name.full')}, ` +
                            `but you can call me ${this.config.fetch('bot.name.nick')}.` +
                            `\n\nPlease give me a few seconds so I can collect some information` +
                            `about this chat before you use any commands.`;
                api.sendMessage(msg, message.threadID);
            }
            if (!err) {
                api.getThreadInfoGraphQL(message.threadID, (err: fb.Error, thread: fb.ThreadInfoGraphQL) => {
                    if (thread) {
                        const threadInfo: gi.IGroupInfo = info || <gi.IGroupInfo>{};
                        threadInfo.threadID = message.threadID;
                        threadInfo.name = thread.threadName;
                        threadInfo.emoji = thread.emoji;
                        threadInfo.color = thread.color ? `#${thread.color}` : undefined;
                        if (thread.nicknames && thread.nicknames[this.config.fetch('bot.id')]) {
                            delete thread.nicknames[this.config.fetch('bot.id')];
                        }
                        threadInfo.nicknames = thread.nicknames;
                        if (newThread) {
                            threadInfo.aliases = {};
                            threadInfo.isGroup = (thread.threadType === 'group');
                        }
                        api.getUserInfo(thread.participantIDs, (err: fb.Error, userInfo: fb.Dictionary<fb.UserInfo>) => {
                            if (!err) {
                                threadInfo.members = {};
                                threadInfo.names = {};
                                for (const userId in userInfo) {
                                    if (userInfo.hasOwnProperty(userId) && userId != this.config.fetch('bot.id')) {
                                        threadInfo.members[userInfo[userId].firstName.toLowerCase()] = userId;
                                        threadInfo.names[userId] = userInfo[userId].firstName;
                                    }
                                }
                                const aliases = Object.keys(threadInfo.aliases);
                                const matches = Object.keys(threadInfo.members);
                                threadInfo.userRegExp = this.config.getRegexFromMembers(matches.concat(aliases));
                                this.setGroupInfo(threadInfo, (err: fb.Error) => {
                                    if (!info) {
                                        const trigger = this.config.fetch('bot.trigger');
                                        api.sendMessage(`And we're all set. Ask me for help using ${trigger} as prefix.\n\nex: '${trigger} help'`, message.threadID);
                                    }
                                    if (this.hasCallback(callback)) {
                                        callback(undefined, threadInfo);
                                    }
                                });
                            }
                        });
                    } else {
                        console.error(`Thread info was not found for ${message.threadID}`);
                        if (this.hasCallback(callback)) {
                            callback({error: 'err'}) ;
                        }
                    }
                });
            } else {
                console.error(err);
                if (this.hasCallback(callback)) {
                    callback({error: err.message});
                }
            }
        });
    }

    private setGroupInfo(threadInfo: gi.IGroupInfo, callback?: (error: fb.Error, updatedThread?: gi.IGroupInfo) => void) {
        const options: mongoose.ModelFindOneAndUpdateOptions = {
            upsert: true,
            new: true,
        };
        gi.GroupInfo.findOneAndUpdate({threadID: threadInfo.threadID}, threadInfo, options, (err: any, res: any) => {
            callback(err, res);
        });
    }

    private hasCallback(func: any) {
        return (func && typeof func === 'function');
    }
}
