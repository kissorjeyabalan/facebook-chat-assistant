import * as chat from 'facebook-chat-api';
import * as fs from 'fs';
import * as _ from 'lodash';
import { setTimeout } from 'timers';
import { Configuration } from './config/Configuration';
import { ConnectionManager } from './db/ConnectionManager';
import { Global } from './Global';
import ScheduleHandler from './module/handler/ScheduleHandler';
import { MessageParser } from './parser/MessageParser';
import { ImageUtil } from './util/ImageUtil';
import { Reddit } from './util/Reddit';

ConnectionManager.getInstance().openConnection();
const config = Configuration.getInstance();
const mp: MessageParser = new MessageParser();

const options: chat.ApiOptions = {
    logLevel: config.fetch('login.logLevel'),
    selfListen: config.fetch('login.selfListen'),
    listenEvents: config.fetch('login.listenEvents'),
    pageID: config.fetch('login.pageID'),
    updatePresence: config.fetch('login.updatePresence'),
    forceLogin: config.fetch('login.forceLogin'),
};

const creds: chat.LoginCredentials | chat.AppState = config.hasAppState() ? {
    appState: config.getAppState(),
} : {
    email: config.fetch('account.username'),
    password: config.fetch('account.password'),
};

chat(creds, options, (err: chat.Error, api: chat.Api) => {
    if (err) {
        switch (err.error) {
            case 'login-approval':
                console.log(`Please verify your login externally. You have ${config.fetch('login.timeout')}s to approve it.`);
                setTimeout(() => err.continue(), config.fetch('login.timeout') * 1000);

                return;
            default:
                console.log('Could not log in. Shutting down...');
                ConnectionManager.getInstance().closeConnection();
                process.exit();
        }
    }

    fs.writeFileSync(config.fetch('account.state'), JSON.stringify(api.getAppState()));
    Global.getInstance().setApi(api);

    const sh: ScheduleHandler = new ScheduleHandler();
    sh.start();

    api.listen((error: chat.Error, message: chat.MessageEvent) => {
        if (message.senderID != config.fetch('bot.id')) {
            mp.handle(message);
        }
    });
});
