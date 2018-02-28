import * as discord from 'discord.js';
import { Configuration } from '../config/Configuration';

export class Discord {
    private static instance: Discord = new Discord();
    private config: Configuration = Configuration.getInstance();
    private disc: discord.Client;

    private constructor() {
        if (Discord.instance) {
            throw new Error('FindMyFriends already exists!');
        }

        this.disc = new discord.Client();
        this.disc.login(this.config.fetch('discord.token'));
    }

    // tslint:disable-next-line:function-name
    public static getInstance(): Discord {
        return Discord.instance;
    }

    public client(): any {
        return this.disc;
    }
}
