import { Promise } from 'bluebird';
import { Api, MessageEvent } from 'facebook-chat-api';
import { Global } from '../../Global';
import EasterEgg from '../EasterEgg';
import { GroupHelper } from '../../db/helper/GroupHelper';
import { IGroupInfo, GroupInfo } from '../../db/model/GroupInfo';
import { setTimeout } from 'timers';
import { Configuration } from '../../config/Configuration';
import * as _ from 'lodash';

export default class ExecuteOrder extends EasterEgg {
    protected regex: RegExp = /(execute order 928)|(execute order 66)/i;
    private gh: GroupHelper = GroupHelper.getInstance();
    private firstMsg: boolean = true;
    private api: Api;

    public handleEgg(msg: MessageEvent): any {
        if (this.firstMsg) {
            this.api = Global.getInstance().getApi();
            this.firstMsg = false;
        }

        if (!_.includes(Configuration.getInstance().fetch("bot.admin"), Number(msg.senderID))) {
            this.api.sendMessage("You're not authorized to execute this protocol, Jedi scum.", msg.threadID);

            return Promise.resolve(msg);
        }

        const order928 = /execute order 928/i;
        const order66 = /execute order 66/i;

        if (msg.body.match(order928)) {
            this.gh.getGroupInfo(msg.threadID, (err: Error, info: IGroupInfo) => {
                if (!err && info.isGroup) {
                    this.api.sendMessage('I hate losers.', msg.threadID);
                    setTimeout(() => {
                        if (msg.senderID != Configuration.getInstance().fetch("bot.id")) {
                            this.kick(msg.senderID, msg.threadID, 10, () => {
                                this.api.sendMessage("Balance has been restored to the Force.", msg.threadID);
                            });
                        }
                    }, 3000);
                }
            });
        } else if (msg.body.match(order66)) {
            this.gh.getGroupInfo(msg.threadID, (err: Error, info: IGroupInfo) => {
                if (!err && info.isGroup) {
                    this.api.sendMessage('I hate you all.', msg.threadID);
                    setTimeout(() => {
                        let callbackmsg = false;
                        for (const m in info.members) {
                            if (info.members.hasOwnProperty(m) && info.members[m] != Configuration.getInstance().fetch("bot.id")) {
                                if (!callbackmsg) {
                                    this.kick(info.members[m], msg.threadID, 6, () => {
                                        this.api.sendMessage("Balance is restored to the Force.", msg.threadID);
                                    });
                                    callbackmsg = true;
                                } else {
                                    this.kick(info.members[m], msg.threadID, 6);
                                }
                            }
                        }
                    }, 4000);
                }
            });
        }

        return Promise.resolve(msg);
    }

    private kick(userId: string, threadId: string, time: number, callback: any = () => {}) {
        if (userId != Configuration.getInstance().fetch("bot.id")) {
            this.api.removeUserFromGroup(userId, threadId, (err) => {
                if (err) {
                    console.error(`Could not kick user from chat ${threadId}`);
                } else {
                    if (time) {
                        setTimeout(() => {
                            this.api.addUserToGroup(userId, threadId);
                            callback();
                        }, time * 1000);
                    }
                }
            });
        }
    }
}
