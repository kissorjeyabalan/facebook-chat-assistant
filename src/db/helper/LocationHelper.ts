import * as fb from 'facebook-chat-api';
import * as mongoose from 'mongoose';
import { Configuration } from '../../config/Configuration';
import { Global } from '../../Global';
import * as li from '../model/LocationInfo';
import { resolve } from 'bluebird';

export class LocationHelper {
    private static instance: LocationHelper = new LocationHelper();
    private config: Configuration = Configuration.getInstance();
    private global: Global = Global.getInstance();

    private constructor() {
        if (LocationHelper.instance) {
            throw Error('Error: LocationHelper already exists.');
        }
        LocationHelper.instance = this;
    }

    // tslint:disable-next-line:function-name
    public static getInstance() {
        return LocationHelper.instance;
    }

    public getLastLocation(user: string, callback?: (err: Error, loc: li.ILocationInfo) => void): Promise<any> {
        return new Promise(resolve => {
            li.LocationInfo.findOne({user: user}, (err, obj) => {
                resolve();
                if (err) {
                    callback(new Error('Query Error'), undefined);
                } else if (obj !== null) {
                    callback(undefined, obj);
                } else {
                    callback(undefined, undefined);
                }
            }).lean();
        });
    }

   public updateLocation(updatedLoc: li.ILocationInfo, callback?: (err: Error, found: li.ILocationInfo) => void): Promise<any> {
       return new Promise(resolve => {
        const options: mongoose.ModelFindOneAndUpdateOptions = {
            upsert: true,
            new: true,
        };
        li.LocationInfo.findOneAndUpdate({user: updatedLoc.user}, updatedLoc, options, (err: any, res: any) => {
            resolve();
            callback(err, res);
        });
       });
   }
}
