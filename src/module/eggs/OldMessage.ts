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

export default class OldMessage extends EasterEgg {
    protected regex: RegExp = /(^[rm]{2}$)|(^rm [0-9]$)/i;
    private gh: GroupHelper = GroupHelper.getInstance();
    
    public handleEgg(msg: fb.MessageEvent): any {
	
	let z = 1;
	//console.log(msg.body);
	const x = msg.body.split("rm ");
	console.log(x);
	if (x.length == 2) {
	z = parseInt(x[1]);
	}	

	for(let i = 0; i < z; i++) {
	this.sendMessage(msg);
        }
        return Promise.resolve(msg);
    }

    public sendMessage(msg) {
	const api = Global.getInstance().getApi();

	sm.getModel(msg).count({}, (err, count) => {
            if (!err) {
                const random = Math.floor(Math.random() * count);
                sm.getModel(msg).findOne({}).skip(random).exec((err, res: sm.SavedMessageModel) => {
                    if (!err) {
                        this.gh.getGroupInfo(msg.threadID, (err, info: IGroupInfo) => {
                            if (!err) {
                        if (res.message.toLowerCase().startsWith("emol") || res.message.toLowerCase().startsWith("r ") || res.message.toLowerCase() == 'rm' || res.message.toLowerCase() == 'where is everyone' || res.message.toLowerCase().startsWith("x ")) {
        this.sendMessage(msg);
        return;
}
                                const name = info.names[res.senderID];
                                const time = new Date(res.timestamp);
                                api.sendMessage(`${res.message}\n-- ${name}`, msg.threadID);
                            }
                        });
                    }
                });
            }
        });

    }

}
