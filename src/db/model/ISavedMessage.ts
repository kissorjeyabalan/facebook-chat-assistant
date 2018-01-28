import * as mongoose from 'mongoose';

interface ISavedMessage {
    threadID: string;
    senderID: string;
    message: string;
    timestamp?: number;
}

interface ISavedMessageModel extends ISavedMessage, mongoose.Document {}

const savedMessageSchema = new mongoose.Schema({
    threadID: {type: String, required: true},
    senderID: {type: String, required: true},
    message: {type: String, required: true},
    timestamp: Number,
}, {strict: false});

function createSavedMessage(savedMessage: ISavedMessage): mongoose.Model<ISavedMessageModel> {
    const threadID = savedMessage.threadID;
    const collectionName = (`SavedMessages-${threadID}`);

    return mongoose.model<ISavedMessageModel>('SavedMessage', savedMessageSchema, collectionName);
}

export {ISavedMessage, ISavedMessageModel, createSavedMessage};
