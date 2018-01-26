"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import * as fb from 'facebook-chat-api';
const Configuration_1 = require("./config/Configuration");
//const creds: fb.LoginCredentials = {email: 'email', password: 'password'};
/*fb(creds, (err: fb.Error, api: fb.Api) => {
    if (err) { return console.error(err); }

    api.listen((error: fb.Error, message: fb.MessageEvent) => {
        if (error) { return console.error(error); }

        console.log(`${message.senderID}: ${message.body}`);
        console.log(`Sent to thread: ${message.threadID}`);
    });
});*/
const config = new Configuration_1.Configuration();
console.log(config.has('mongodb'));
console.log(config.has('mongodb.port'));
//# sourceMappingURL=server.js.map