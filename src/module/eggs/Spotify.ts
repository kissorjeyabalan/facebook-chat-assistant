import * as fb from 'facebook-chat-api';
import * as fs from 'fs';
import * as _ from 'lodash';
import * as request from 'request';
import { Configuration } from '../../config/Configuration';
import { Global } from '../../Global';
import EasterEgg from '../EasterEgg';

export default class Spotify extends EasterEgg {
	protected regex: RegExp = /emol play *(.+)/i;

	private spotify: any = new (require('spotify-web-api-node'))({
		clientId: 'clientId',
		clientSecret: 'clientSecret',
	});

	private dirRoot: string = `${__dirname}/../..`;


	public async handleEgg(msg: fb.MessageEvent): Promise<any> {
		const api = Global.getInstance().getApi();
		const regex = /emol play *(.+)/i;
		
		if (!msg.body.match(regex)) {
			return Promise.resolve();
		}
		
		this.logInSpotify((err) => {
			console.log('attempting login');
			if (!err) {
				const query = msg.body.match(regex)[1].toLowerCase();
				this.spotify.searchTracks(query, {}, (err, data) => {
					if (!err) {
						const bestMatch = data.body.tracks.items[0];
						console.log(bestMatch);
						if (bestMatch) {
							const message = `ɴᴏᴡ ᴘʟᴀʏɪɴɢ: ${bestMatch.name}\n───○ 🔊⠀ ᴴᴰ ⚙️`;
							const url = bestMatch.external_urls.spotify;
							let preview = bestMatch.preview_url;
							let iteration = 0;
							while (!preview && iteration < data.body.tracks.items.length) {
								iteration += 1;
								preview = data.body.tracks.items[iteration].preview_url;
								console.log(data.body.tracks.items[iteration]);
								if (preview) {

									const options: request.OptionsWithUri = {
										method: 'GET',
										uri: preview,
										headers: {
											'User-Agent': `${Configuration.getInstance().fetch('bot.name.nick')}/${module.exports.version}`,
										},
										encoding: null,
									};

									request(options).on('response', (res) => {
										res.pipe(fs.createWriteStream(`${this.dirRoot}/media/temp/med.mp3`)).on('close', (err, data) => {
											if (!err) {
												console.log(data);
												const audioMessage: fb.AttachmentMessage = {
													body: message,
													attachment: fs.createReadStream(`${this.dirRoot}/media/temp/med.mp3`),
												};
												api.sendMessage(audioMessage, msg.threadID, (err, data) => {
													fs.unlink(`${this.dirRoot}/media/temp/med.mp3`, (err) => {
														if (err) {
															console.log(err);
														}
													});
												});
											} else {
												console.log(err);
												api.sendMessage('failed to download :(((((', msg.threadID);
											}
										});
									});
								} else if (iteration <= data.body.tracks.items.length) {
									api.sendMessage('no', msg.threadID);
								}
							}
						}
					} else {
						console.log(err);
					}
				});
			} else {
				console.log(err);
			}
		});
	}
	
	private logInSpotify(callback: any = () => {}) {
		this.spotify.clientCredentialsGrant({}, (err, data) => {
			if (!err) {
				this.spotify.setAccessToken(data.body.access_token);
				callback();
			} else {
				callback(err);
			}
		});
	}
}
