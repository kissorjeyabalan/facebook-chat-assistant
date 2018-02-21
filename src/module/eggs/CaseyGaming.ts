import { Promise } from 'bluebird';
import * as fb from 'facebook-chat-api';
import * as _ from 'lodash';
import * as request from 'request';
import { Configuration } from '../../config/Configuration';
import { Global } from '../../Global';
import EasterEgg from '../EasterEgg';

export default class CaseyGaming extends EasterEgg {
    protected regex: RegExp = /is casey gaming/i;

    public handleEgg(msg: fb.MessageEvent): any {
        const api = Global.getInstance().getApi();
        const key = Configuration.getInstance().fetch('steam.key');
        const uri = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${key}&steamids=76561198073429605`;
        const options: request.OptionsWithUri = {
            method: 'GET',
            uri: uri,
            headers: {
                'User-Agent': `${Configuration.getInstance().fetch('bot.name.nick')}/${module.exports.version}`,
            },
            encoding: 'utf8',
        };

        request(options)
        .on('error', (err) => {
            console.log(err);
        })
        .on('response', (res) => {
            res.on('data', (data) => {
                const json = JSON.parse(data.toString());
                if (_.has(json, 'response.players[0].gameid')) {
                    const gameName = _.get(json, 'response.players[0].gameextrainfo');
                    api.sendMessage(`Casey is currently playing ${gameName}.`, msg.threadID);
                } else {
                    api.sendMessage(`Casey is currently not playing anything.`, msg.threadID);
                }
            });
        });

        return Promise.resolve(msg);
    }
}
