import { Api } from 'facebook-chat-api';

export class Global {
    private static instance: Global = new Global();
    private api: Api;

    private constructor() {
        if (Global.instance) {
            throw Error('Global values are already initalized.');
        }
        Global.instance = this;
    }

    // tslint:disable-next-line:function-name
    public static getInstance(): Global {
        return Global.instance;
    }

    public setApi(api: Api) {
        this.api = api;
    }

    public getApi(): Api {
        return this.api;
    }
}
