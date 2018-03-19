import * as discord from 'discord.js';
import * as fb from 'facebook-chat-api';
import * as _ from 'lodash';
import * as request from 'request';
import { Configuration } from '../../config/Configuration';
import { Global } from '../../Global';
import { Discord } from '../../util/Discord';
import EasterEgg from '../EasterEgg';

export default class PlayerGaming extends EasterEgg {
    protected regex: RegExp = /(is *(.+) gaming)|(what is *(.+) doing)/i;

    public async handleEgg(msg: fb.MessageEvent): Promise<any> {
        const api = Global.getInstance().getApi();

        const regex = /is (.*?) gaming/i;
        const regex2 = /what is *(.+) doing/i;

        let person = null;
        if (msg.body.match(regex)) {
            person = msg.body.match(regex)[1].toLowerCase();
        } else if (msg.body.match(regex2)) {
            person = msg.body.match(regex2)[1].toLowerCase();
        } else {
            return Promise.reject('Failed to match');
        }
        const users = Configuration.getInstance().fetch('gaming.users');

        if (users[person] === undefined) {
            api.sendMessage(`I don't know what ${this.capitalizeFirstLetter(person)} is doing.`, msg.threadID);

            return Promise.resolve(msg);
        }

        const discordID = users[person].discord;
        const steamID = users[person].steam;

        let game = await this.getDiscordGame(discordID);

        if (game == null) {
            game = await this.getSteamGame(steamID);
        }

        if (game != null) {
            api.sendMessage(`${this.capitalizeFirstLetter(person)} is currently in ${game}.`, msg.threadID);
        } else {
            api.sendMessage(`I don't know what ${this.capitalizeFirstLetter(person)} is doing.`, msg.threadID);
        }

        return Promise.resolve(msg);
    }

    private getDiscordGame(discordID: string) {
        const client: discord.Client = Discord.getInstance().client();

        return new Promise(r => {
            client.fetchUser(discordID)
                .then((user: discord.User) => {
                    if (user.presence.game == null) {
                        r(null);
                    } else {
                        r(user.presence.game.name);
                    }
                });
        });
    }

    private getSteamGame(steamID: string) {
        const key = Configuration.getInstance().fetch('steam.key');
        const uri = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${key}&steamids=${steamID}`;
        const options: request.OptionsWithUri = {
            method: 'GET',
            uri: uri,
            headers: {
                'User-Agent': `${Configuration.getInstance().fetch('bot.name.nick')}/${module.exports.version}`,
            },
            encoding: 'utf8',
        };

        return new Promise(r => {
            request(options)
        .on('error', (err) => {
            r(null);
        })
        .on('response', (res) => {
            res.on('data', (data) => {
                const json = JSON.parse(data.toString());
                if (_.has(json, 'response.players[0].gameid')) {
                    const gameName = _.get(json, 'response.players[0].gameextrainfo');
                    r(gameName);
                } else {
                    r(null);
                }
            });
        });
        });
    }

    private capitalizeFirstLetter(word: string) {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }
}
