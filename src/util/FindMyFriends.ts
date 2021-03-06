// tslint:disable-next-line:no-implicit-dependencies
import * as fmf from 'find-my-friends-api';

import { Configuration } from '../config/Configuration';

export class FindMyFriends {
    private static instance: FindMyFriends = new FindMyFriends();
    private config: Configuration = Configuration.getInstance();
    private friend: any;

    private constructor() {
        if (FindMyFriends.instance) {
            throw new Error('FindMyFriends already exists!');
        }

        this.init();
        FindMyFriends.instance = this;
    }

    // tslint:disable-next-line:function-name
    public static getInstance(): FindMyFriends {
        return FindMyFriends.instance;
    }

    public getFriend(): any {
        return this.friend;
    }

    public async init() {
        this.friend = new fmf();
        await this.friend.login(this.config.fetch('fmf.user'), this.config.fetch('fmf.pass'));
        this.friend.getAllLocations();
    }
}
