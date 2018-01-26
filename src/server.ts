import * as chat from 'facebook-chat-api';
import * as fs from 'fs';
import { setTimeout } from 'timers';
import { Configuration } from './config/Configuration';
import { ConnectionManager } from './db/ConnectionManager';

ConnectionManager.getInstance().openConnection();
const config = Configuration.getInstance();

const options: chat.ApiOptions = {
    logLevel: config.fetch('login.logLevel'),
    selfListen: config.fetch('login.selfListen'),
    listenEvents: config.fetch('login.listenEvents'),
    pageID: config.fetch('login.pageID'),
    updatePresence: config.fetch('login.updatePresence'),
    forceLogin: config.fetch('login.forceLogin'),
};

const creds: chat.LoginCredentials | chat.AppState = hasAppState() ? {
    appState: JSON.parse(fs.readFileSync(config.fetch('account.state'), 'utf-8')),
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
});

function hasAppState(): boolean {
    return fs.existsSync(config.fetch('account.state'));
}
