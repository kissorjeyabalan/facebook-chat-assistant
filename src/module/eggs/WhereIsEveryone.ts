import { Api, Error, MessageEvent } from 'facebook-chat-api';
import { Global } from '../../Global';
import { FindMyFriends } from '../../util/FindMyFriends';
import EasterEgg from '../EasterEgg';
import { LocationHelper } from '../../db/helper/LocationHelper';
import { setTimeout } from 'timers';
import { Configuration } from '../../config/Configuration';

export default class WhereIsEveryone extends EasterEgg {
    protected regex: RegExp = /where is everyone/i;

    public async handleEgg(msg: MessageEvent): Promise<any> {
        const api = Global.getInstance().getApi();
        const locs = await this.buildMessage();

        api.sendMessage(locs.toString().trim(), msg.threadID);

        return Promise.resolve(msg);
    }

    private async buildMessage() {
        const lh = LocationHelper.getInstance();
        const map = Configuration.getInstance().fetch('fmf.users');

         let message: string = '';
            for (const [k, v] of Object.entries(map)) {
                await new Promise(resolve => {
                    lh.getLastLocation(k, (err, loc) => {
                        if (err) {
                            message += `\n\n${v} could not be located.`;
                        } else {
                            let streetname = '';

                            if (loc.streetaddress != null) {
                                streetname = loc.streetaddress;
                            } else if (loc.streetname != null) {
                                streetname = loc.streetname;
                            }

                            if (streetname.trim().length == 0 && loc.country != null) {
                                message += `\n\n${v} was last seen in ${loc.locality}, ${loc.country}.`;
                            } else {
                                message += `\n\n${v} was last seen at ${streetname}, ${loc.zip} ${loc.locality}.`;
                            }
                            streetname = '';
                        }
                    });
                    resolve();
                });
            }

            await this.sleep(1000);

            return new Promise(resolve => resolve(message));
    }

    private sleep(ms: number = 0) {
        return new Promise(r => setTimeout(r, ms));
      }
}
