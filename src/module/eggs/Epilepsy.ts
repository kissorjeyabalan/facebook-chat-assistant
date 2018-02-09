import { Promise } from 'bluebird';
import * as fb from 'facebook-chat-api';
import { setTimeout } from 'timers';
import { GroupHelper } from '../../db/helper/GroupHelper';
import * as gi from '../../db/model/GroupInfo';
import { Global } from '../../Global';
import EasterEgg from '../EasterEgg';

export default class Epilepsy extends EasterEgg {
    protected regex: RegExp = /(flash me)|(gimme dat epilepsy)/i;
    private gh: GroupHelper = GroupHelper.getInstance();

    public handleEgg(msg: fb.MessageEvent): any {
        const api = Global.getInstance().getApi();

        console.log('trying to epilepsy');

        this.gh.getGroupInfo(msg.threadID, (err: Error, info: gi.IGroupInfo) => {
            if (!err) {
                const currColor = info.color || null;
                const delay = 500;

                for (let i = 0; i < 10; i += i) {
                    setTimeout(() => {
                        api.changeThreadColor(this.getRandomColor(api), msg.threadID);
                    }, delay + (i * delay));
                    if (i === 10) {
                        api.changeThreadColor(currColor, msg.threadID);
                    }
                }
            }
        });

        return Promise.resolve(msg);
    }

    private getRandomColor(api: fb.Api) {
        const colors = Object.keys(api.threadColors).map(n => api.threadColors[n]);

        return colors[Math.floor(Math.random() * colors.length)];
    }
}
