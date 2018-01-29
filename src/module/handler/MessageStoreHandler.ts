import { MessageEvent } from 'facebook-chat-api';
import { createSavedMessage, ISavedMessage } from '../../db/model/ISavedMessage';
import Handler from '../Handler';

export default class MessageStoreHandler extends Handler {
    public handle(message: MessageEvent): MessageEvent {
        const savedMessage: ISavedMessage = {
            threadID: message.threadID,
            senderID: message.senderID,
            message: message.body,
            timestamp: message.timestamp,
        };

        const dbMsg = new (createSavedMessage(savedMessage))(savedMessage);
        dbMsg.save();

        return message;
    }
}
