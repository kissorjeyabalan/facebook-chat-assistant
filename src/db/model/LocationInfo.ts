import * as mongoose from 'mongoose';

interface ILocationInfo {
    user: string,
    country: string;
    streetname: string;
    streetaddress: string;
    countrycode: string;
    locality: string;
    administrativearea: string;
    zip: string;
}

interface LocationInfoModel extends ILocationInfo, mongoose.Document {}

const locationInfoSchema = new mongoose.Schema({
    user: {type: String, required: true},
    country: {type: String, required: false},
    streetname: {type: String, required: false},
    streetaddress: {type: String, required: false},
    countrycode: {type: String, required: false},
    locality: {type: String, required: false},
    administrativearea: {type: String, required: false},
    zip: {type: String, required: false},
}, {versionKey: false});

const LocationInfo = mongoose.model<LocationInfoModel>('LocationInfo', locationInfoSchema);

export {ILocationInfo, LocationInfoModel, LocationInfo};
