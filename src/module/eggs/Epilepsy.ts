import { Promise } from 'bluebird';
import * as fb from 'facebook-chat-api';
import { setTimeout } from 'timers';
import { GroupHelper } from '../../db/helper/GroupHelper';
import * as gi from '../../db/model/GroupInfo';
import { Global } from '../../Global';
import EasterEgg from '../EasterEgg';
import { Configuration } from '../../config/Configuration';
import * as sm from '../../db/model/SavedMessage';
import { IGroupInfo } from '../../db/model/GroupInfo';

export default class Epilepsy extends EasterEgg {
    protected regex: RegExp = /randmess/i;
    private gh: GroupHelper = GroupHelper.getInstance();


    public handleEgg(msg: fb.MessageEvent): any {
        const api = Global.getInstance().getApi();

        sm.getModel(msg).count({}, (err, count) => {
            if (!err) {
                const random = Math.floor(Math.random() * count);
                sm.getModel(msg).findOne({}).skip(random).exec((err, res: sm.SavedMessageModel) => {
                    if (!err) {
                        this.gh.getGroupInfo(msg.threadID, (err, info: IGroupInfo) => {
                            if (!err) {
                                const name = info.names[res.senderID];
                                const time = new Date(res.timestamp);
                                api.sendMessage(`${res.message}\n-- ${name}, ${time.getDate()}/${time.getMonth() + 1}/${time.getYear() - 100}, ${time.getHours()}:${time.getMinutes()}`, msg.threadID);
                            }
                        });
                    }
                });
            }
        });

        return Promise.resolve(msg);
    }
}
