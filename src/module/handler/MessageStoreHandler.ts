import { MessageEvent } from 'facebook-chat-api';
import { GroupHelper } from '../../db/helper/GroupHelper';
import { getModel, ISavedMessage } from '../../db/model/SavedMessage';
import Handler from '../Handler';

export default class MessageStoreHandler extends Handler {
    public handle(message: MessageEvent): MessageEvent {
        const savedMessage: ISavedMessage = {
            threadID: message.threadID,
            senderID: message.senderID,
            message: message.body,
            timestamp: message.timestamp,
        };

        const dbMsg = new (getModel(message))(savedMessage);
        dbMsg.save();

        const test = GroupHelper.getInstance();
        test.updateGroupInfo(message);

        return message;
    }
}
