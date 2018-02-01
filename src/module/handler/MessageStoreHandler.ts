import { Error, MessageEvent, ThreadInfoGraphQL } from 'facebook-chat-api';
import { GroupHelper } from '../../db/helper/GroupHelper';
import * as gi from '../../db/model/GroupInfo';
import { getModel, ISavedMessage } from '../../db/model/SavedMessage';
import { Global } from '../../Global';
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

        GroupHelper.getInstance().updateGroupInfo(message);

        return message;
    }
}
