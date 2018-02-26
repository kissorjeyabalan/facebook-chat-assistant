import * as fb from 'facebook-chat-api';
import * as ns from 'node-schedule';
import { Configuration } from '../../config/Configuration';
import { LocationHelper } from '../../db/helper/LocationHelper';
import { Global } from '../../Global';
import Schedule from '../Schedule';
import { FindMyFriends } from '../../util/FindMyFriends';
import { ILocationInfo } from '../../db/model/LocationInfo';

export default class LocationUpdater extends Schedule {
    private dirRoot: string = `${__dirname}/../..`;
    public async start(): Promise<any> {
        const config: Configuration = Configuration.getInstance();
        const lh: LocationHelper = LocationHelper.getInstance();
        const fmf: any = FindMyFriends.getInstance().getFriend();

        setInterval(async () => {
            const locs = await fmf.getAllLocations();
            for (const i in locs) {
                if (locs[i].location != null) {
                    const locInf: ILocationInfo = {
                        user: locs[i].id,
                        country: locs[i].location.address.country,
                        streetname: locs[i].location.address.streetName,
                        streetaddress: locs[i].location.address.streetAddress,
                        countrycode: locs[i].location.address.countryCode,
                        locality: locs[i].location.address.locality,
                        administrativearea: locs[i].location.address.administrativeArea,
                        zip: locs[i].location.address.formattedAddressLines[1].split(' ')[0],
                    };
                    lh.updateLocation(locInf, (err, found) => {});
                }
            }
        }, 720000);
    }
}
