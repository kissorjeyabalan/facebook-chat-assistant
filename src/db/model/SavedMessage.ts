import { MessageEvent } from 'facebook-chat-api';
import * as mongoose from 'mongoose';

interface ISavedMessage {
    threadID: string;
    senderID: string;
    message: string;
    timestamp?: number;
}

interface SavedMessageModel extends ISavedMessage, mongoose.Document {}

const savedMessageSchema = new mongoose.Schema({
    threadID: {type: String, required: true},
    senderID: {type: String, required: true},
    message: {type: String, required: true},
    timestamp: Number,
}, {strict: false});

function getModel(message: MessageEvent): mongoose.Model<SavedMessageModel> {
    const collectionName = (`SavedMessages-${message.threadID}`);

    return mongoose.model<SavedMessageModel>('SavedMessage', savedMessageSchema, collectionName);
}

export {ISavedMessage, SavedMessageModel, getModel};
