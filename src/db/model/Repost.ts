import * as mongoose from 'mongoose';

interface IRepost {
    chatid: string,
    post: string;
    posturl: string;
}

interface RepostModel extends IRepost, mongoose.Document {}

const repostSchema = new mongoose.Schema({
    chatid: {type: String, required: true},
    post: {type: String, required: true},
    posturl: {type: String, required: true}
}, {versionKey: false});

const Repost = mongoose.model<RepostModel>('Repost', repostSchema);

export {IRepost, RepostModel, Repost};
