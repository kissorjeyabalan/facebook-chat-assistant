import * as fb from 'facebook-chat-api';

const creds: fb.ILoginCredentials = {email: 'email', password: 'password'};

fb(creds, (err: fb.IError, api: fb.Api) => {
    if (err) { return console.error(err); }

    api.listen((error: fb.IError, message: fb.IMessageEvent) => {
        if (error) { return console.error(error); }

        console.log(`${message.senderID}: ${message.body}`);
        console.log(`Sent to thread: ${message.threadID}`);
    });
});
