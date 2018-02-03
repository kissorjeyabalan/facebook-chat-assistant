import * as fb from 'facebook-chat-api';
import { Configuration } from '../../config/Configuration';
import { Global } from '../../Global';

export class UserHelper {
    private static instance: UserHelper = new UserHelper();
    private config: Configuration = Configuration.getInstance();
    private global: Global = Global.getInstance();

    private constructor() {
        if (UserHelper.instance) {
            throw Error('Error: UserHelper already exists.');
        }
        UserHelper.instance = this;
    }

    // tslint:disable-next-line:function-name
    public static getInstance() {
        return UserHelper.instance;
    }

    public getFirstName(id: string, callback: (err: fb.Error, data: fb.UserInfo) => void) {
        const api = this.global.getApi();
        api.getUserInfo(id, (err: fb.Error, obj: fb.Dictionary<fb.UserInfo>) => {
            if (err) {
                callback(err, undefined);
            } else {
                callback(undefined, obj[id]);
            }
        });
    }
}
