import * as fb from 'facebook-chat-api';

const creds: fb.LoginCredentials = {email: 'email', password: 'password'};

fb(creds, (err: fb.Error, api: fb.Api) => {
    if (err) { return console.error(err); }

    api.listen((error: fb.Error, message: fb.MessageEvent) => {
        if (error) { return console.error(error); }

        console.log(`${message.senderID}: ${message.body}`);
        console.log(`Sent to thread: ${message.threadID}`);
    });
});
