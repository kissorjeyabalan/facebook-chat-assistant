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

        const didNotUnderstandArr = [
            'I don\'t understand what you mean.',
            'Did you have a stroke?',
            'I can\'t even...',
            'I can hear you, but I can\'t understand you.',
            'What?',
        ];

        const notSpecific = [
            'I don\'t even know where to begin to answer that.',
            'You don\'t want me to answer that.',
            'I\'d rather not.',
            'I don\'t want to answer that.',
            'I\'d answer that, but you probably won\'t read it.',
            'TL;DR',
        ];

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
                    api.sendMessage(didNotUnderstandArr[this.getRndNum(didNotUnderstandArr.length)], msg.threadID);
                } else if (data.toString() === 'No short answer available') {
                    api.sendMessage(notSpecific[this.getRndNum(notSpecific.length)], msg.threadID);
                } else if (data.toString() === 'My name is Wolfram Alpha.') {
                    api.sendMessage(`My name is ${Configuration.getInstance().fetch('bot.name.nick')}.`, msg.threadID);
                } else if (data.toString() === 'I was created by Stephen Wolfram and his team.') {
                    api.sendMessage('I am my own creator.', msg.threadID);
                } else {
                    api.sendMessage(data.toString(), msg.threadID);
                }
            });
        });

        return Promise.resolve(msg);
    }

    private getRndNum(length: number): number {
        return Math.floor(Math.random() * length);
    }
}
