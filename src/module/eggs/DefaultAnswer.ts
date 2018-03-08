import { Promise } from 'bluebird';
import { Api, Error, MessageEvent } from 'facebook-chat-api';
import * as request from 'request';
import { Configuration } from '../../config/Configuration';
import { Global } from '../../Global';
import EasterEgg from '../EasterEgg';

export default class Love extends EasterEgg {
    protected regex: RegExp = /^emol? /i;

    public handleEgg(msg: MessageEvent): any {
        const query = msg.body.split(' ').slice(1).join(' ').trim();
        if (query.length < 1) {
            return msg;
        }

        const api = Global.getInstance().getApi();
        const key = Configuration.getInstance().fetch('wolfram.key');
        const uri = `https://api.wolframalpha.com/v2/result?appid=${key}&i=${encodeURIComponent(query)}`;

        const options: request.OptionsWithUri = {
            method: 'GET',
            uri: uri,
            headers: {
                'User-Agent': `${Configuration.getInstance().fetch('bot.name.nick')}/${module.exports.version}`,
            },
            encoding: 'utf8',
        };

        request(options)
        .on('response', (res) => {
            res.on('data', (data) => {
                if (data.toString() === 'Wolfram|Alpha did not understand your input') {
                    api.sendMessage('I don\'t understand what you mean.', msg.threadID);
                } else if (data.toString() === 'No short answer available') {
                    api.sendMessage('I don\'t even know where to begin to answer that.', msg.threadID);
                } else {
                    api.sendMessage(data.toString(), msg.threadID);
                }
            });
        });

        return Promise.resolve(msg);
    }
}
