import { Error, MessageEvent } from 'facebook-chat-api';
import * as request from 'request';
import { Configuration } from '../../config/Configuration';
import { Global } from '../../Global';
import Command from '../Command';
import { HelpDetails } from '../HelpDetails';

export default class WolframAlpha extends Command {
    public help: HelpDetails = new HelpDetails('Wolfram', 'w', 'Query Wolfram Alpha',
    'Performs a search to Wolfram Alpha',
    'wolf <query>', 'wolf 2+1', false, false);

    public isValid(args: string): boolean {
        const split = args.split(' ');

        return split.length > 0;
    }

    public run(msg: MessageEvent, query: string): Promise<any> {
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
                    api.sendMessage('I don\'t work for you.', msg.threadID);
                } else {
                    api.sendMessage(data.toString(), msg.threadID);
                }
            });
        });

        return Promise.resolve(msg);
    }

}
