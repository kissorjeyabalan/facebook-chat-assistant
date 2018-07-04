import { Api, Error, MessageEvent } from 'facebook-chat-api';
import * as ns from 'node-schedule';
import { setTimeout } from 'timers';
import { Configuration } from '../../config/Configuration';
import { LocationHelper } from '../../db/helper/LocationHelper';
import { Global } from '../../Global';
import { FindMyFriends } from '../../util/FindMyFriends';
import EasterEgg from '../EasterEgg';
import { ILocationInfo } from '../../db/model/LocationInfo';

export default class ForceLocation extends EasterEgg {
    protected regex: RegExp = /fql/i;

    public async handleEgg(msg: MessageEvent): Promise<any> {
        console.log('force location query triggered');
        if (msg.threadID == '1623275961054128' || msg.threadID == '1420517794899222') {
            const api = Global.getInstance().getApi();
            const config: Configuration = Configuration.getInstance();

            const locMsg = await this.buildMessage();
            api.sendMessage(locMsg.toString().trim(), msg.threadID);
        }
        return Promise.resolve(msg);
    }

    private async buildMessage() {
        const lh = LocationHelper.getInstance();
        const map = Configuration.getInstance().fetch('fmf.users');
        const fmf: any = FindMyFriends.getInstance().getFriend();
        const locs = await fmf.getAllLocations();
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
                    lh.updateLocation(locInf, (err, found) => {});
                }
            }
        await this.sleep(1000);

         let message: string = '';
            for (const [k, v] of Object.entries(map)) {
                await new Promise(resolve => {
                    lh.getLastLocation(k, (err, loc) => {
                        if (err) {
                            message += `\n\n${v} could not be located.`;
                        } else {
                            let streetname = '';

                            if (loc.streetaddress != undefined) {
                                streetname = loc.streetaddress;
                            } else if (loc.streetname != undefined) {
                                streetname = loc.streetname;
                            }

                            if (streetname.trim().length == 0 && loc.country != undefined) {
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

const cron = ns.scheduleJob('14 /3 * * *', async (fireDate) => {
    

});