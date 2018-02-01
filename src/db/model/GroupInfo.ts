import * as mongoose from 'mongoose';

interface IGroupInfo {
    threadID: string;
    name: string;
    emoji: string;
    color?: string;
    nicknames: {[key: string]: string};
    members: {[key: string]: string};
    names: {[key: string]: string};
    aliases?: {[key: string]: string};
    newChat: boolean;
    lastMessage?: string;
    isGroup: boolean;
    userRegExp: string;
}

interface GroupInfoModel extends IGroupInfo, mongoose.Document {}

const groupInfoSchema = new mongoose.Schema({
    threadID: {type: String, required: true},
    name: {type: String, required: true},
    emoji: {type: String, required: true},
    color: {type: String, required: false},
    nicknames: {type: [mongoose.Schema.Types.Mixed], required: true},
    members: {type: [mongoose.Schema.Types.Mixed], required: true},
    names: {type: [mongoose.Schema.Types.Mixed], required: true},
    aliases: {type: [mongoose.Schema.Types.Mixed], required: false},
    newChat: {type: Boolean, required: true},
    lastMessage: {type: String, required: false},
    isGroup: {type: Boolean, required: true},
    userRegExp: {type: String, required: true},
}, {versionKey: false});

const GroupInfo = mongoose.model<GroupInfoModel>('GroupInfo', groupInfoSchema);

export {IGroupInfo, GroupInfoModel, GroupInfo};
