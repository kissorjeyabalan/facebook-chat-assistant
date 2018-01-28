import * as mongoose from 'mongoose';

interface ISavedMessage {
    threadID: string;
    senderID: string;
    message: string;
    timestamp?: number;
}

type SavedMessageType = ISavedMessage & mongoose.Document;

const savedMessageSchema = new mongoose.Schema({
    threadID: {type: String, required: true},
    senderID: {type: String, required: true},
    message: {type: String, required: true},
    timestamp: Number,
}, {strict: false});

// const SavedMessage = mongoose.model<SavedMessageType>('SavedMessage', savedMessageSchema);

// tslint:disable-next-line:no-any
function createSavedMessage(savedMessage: ISavedMessage): any {
    const threadID = savedMessage.threadID;
    const collectionName = (`SavedMessages-${threadID}`);
    const model = mongoose.model<SavedMessageType>('SavedMessage', savedMessageSchema, collectionName);

    return new model(savedMessage);
}

export {ISavedMessage, createSavedMessage};
