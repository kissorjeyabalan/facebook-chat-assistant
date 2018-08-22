import { Api, Error, MessageEvent } from 'facebook-chat-api';
import * as fmf from 'find-my-friends-api'
import { setTimeout } from 'timers';
import { Configuration } from '../../config/Configuration';
import { LocationHelper } from '../../db/helper/LocationHelper';
import { Global } from '../../Global';
import EasterEgg from '../EasterEgg';
import { ILocationInfo } from '../../db/model/LocationInfo';

export default class WhereIsEveryone extends EasterEgg {
    protected regex: RegExp = /where is *(.+)/i;
    private fmf: any = new fmf();
    private config: Configuration = Configuration.getInstance();
    private lh: LocationHelper = LocationHelper.getInstance();

    public async handleEgg(msg: MessageEvent): Promise<any> {
        if (msg.threadID == '1623275961054128' || msg.threadID == '1420517794899222') {
            const api = Global.getInstance().getApi();
            const endTyping = api.sendTypingIndicator(msg.threadID);

            const regex = /where is *(.+)/i;
            const person = msg.body.match(regex)[1];
            console.log('person is ' + person);

            await this.fmf.login(this.config.fetch('fmf.user'), this.config.fetch('fmf.pass'));
            let locs;

            if (person.toLowerCase() === 'everyone') {
                locs = await this.getEveryone();
                api.sendMessage(locs.toString().trim(), msg.threadID);
            } else {
                locs = await this.getSingle(person);
                if (locs !== undefined) {
                    api.sendMessage(locs.toString().trim(), msg.threadID);
                } else {
                    api.sendMessage(`I don't know who ${person} is.`, msg.threadID);
                }
            }


            endTyping();
        }

        return Promise.resolve(msg);
    }

    private async getEveryone(): Promise<any> {

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

    private async getSingle(person: string): Promise<any> {

        const map = Configuration.getInstance().fetch('fmf.users');

        let message: string = '';

        return new Promise(async resolve => {
            for (const [k, v] of Object.entries(map)) {
                console.log(`Checking ${v} against ${person}`);
                if (v === (person.charAt(0).toUpperCase + person.slice(1))) {
                    const loc = await this.fmf.getLocationById(v);
                    await this.saveLocation(loc);
                    message += await this.constructLocationString(k, v);
                    resolve(message);
                    break;
                }
            }
            resolve(undefined);
        });
    }

    private async saveLocation(loc: any): Promise<any> {
        return new Promise(async resolve => {
            if (loc.location != undefined) {
                let zip = '';
                if (loc.location.address.formattedAddressLines[1]) {
                    zip = loc.location.address.formattedAddressLines[1].split(' ')[0];
                }
                const locInf: ILocationInfo = {
                    user: loc.id,
                    country: loc.location.address.country,
                    streetname: loc.location.address.streetName,
                    streetaddress: loc.location.address.streetAddress,
                    countrycode: loc.location.address.countryCode,
                    locality: loc.location.address.locality,
                    administrativearea: loc.location.address.administrativeArea,
                    zip: zip,
                };
                await this.lh.updateLocation(locInf, (err, found) => {});
                resolve();
            }
        });
    }

    private async constructLocationString(k: any, v: any): Promise<any> {
        return new Promise(async res => {
            let message = '';
            await this.lh.getLastLocation(k, (err, loc) => {
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
