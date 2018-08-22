import { Api, Error, MessageEvent } from 'facebook-chat-api';
import * as fmf from 'find-my-friends-api'
import { setTimeout } from 'timers';
import { Configuration } from '../../config/Configuration';
import { LocationHelper } from '../../db/helper/LocationHelper';
import { Global } from '../../Global';
import EasterEgg from '../EasterEgg';
import { ILocationInfo } from '../../db/model/LocationInfo';

export default class WhereIsEveryone extends EasterEgg {
    protected regex: RegExp = /where is everyone/i;
    private fmf: any = new fmf();
    private config: Configuration = Configuration.getInstance();
    private lh: LocationHelper = LocationHelper.getInstance();

    public async handleEgg(msg: MessageEvent): Promise<any> {
        if (msg.threadID == '1623275961054128' || msg.threadID == '1420517794899222') {
            const api = Global.getInstance().getApi();
            const endTyping = api.sendTypingIndicator(msg.threadID);
            await this.fmf.login(this.config.fetch('fmf.user'), this.config.fetch('fmf.pass'));
            await this.fmf.getAllLocations();
            const locs = await this.buildMessage();
            api.sendMessage(locs.toString().trim(), msg.threadID);
            endTyping();
        }

        return Promise.resolve(msg);
    }

    private async buildMessage() {

        const map = Configuration.getInstance().fetch('fmf.users');

        let message: string = '';

        const locs = await this.fmf.getAllLocations();

        return new Promise(async resolve => {
            for (const i in locs) {
                if (locs[i].location != undefined) {
                    let zip = '';
                    if (locs[i].location.address.formattedAddressLines[1]) {
                        zip = locs[i].location.address.formattedAddressLines[1].split(' ')[0];
                    }
                    const locInf: ILocationInfo = {
                        user: locs[i].id,
                        country: locs[i].location.address.country,
                        streetname: locs[i].location.address.streetName,
                        streetaddress: locs[i].location.address.streetAddress,
                        countrycode: locs[i].location.address.countryCode,
                        locality: locs[i].location.address.locality,
                        administrativearea: locs[i].location.address.administrativeArea,
                        zip: zip,
                    };
                    await this.lh.updateLocation(locInf, (err, found) => {});
                }
            }

            for (const [k, v] of Object.entries(map)) {
                message += await this.constructLocationString(k, v);
            }
            resolve(message);
        });

    }

    private async constructLocationString(k: any, v: any) {
        return new Promise(async res => {
            let message = '';
            await this.lh.getLastLocation(k, (err, loc) => {
                if (err) {
                    message += `\n\n${v} could not be located.`;
                } else {
                    let streetname = '';
                    if (loc.streetaddress != undefined) {
                        streetname = loc.streetaddress;
                    }
                    if (loc.streetname != undefined) {
                        streetname = loc.streetname;
                    }
                    if (streetname.trim().length == 0 && loc.country != undefined) {
                        message += `\n\n${v} was last seen in ${loc.locality}, ${loc.country}.`;
                    } else {
                        message += `\n\n${v} was last seen at ${streetname}, ${loc.zip} ${loc.locality}.`;
                    }
                    res(message);
                }
            });
            res(message);
        });
    }

    private sleep(ms: number = 0) {
        return new Promise(r => setTimeout(r, ms));
      }
}
