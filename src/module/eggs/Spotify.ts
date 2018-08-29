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


		console.log('Spotify command triggered.');
		
		if (!msg.body.match(regex)) {
			console.log('Spotify: Invalid syntax.');
			return Promise.resolve();
		}
		
		this.logInSpotify((err) => {
			console.log('attempting login');
			if (!err) {
				const query = msg.body.match(regex)[1].toLowerCase();
				this.spotify.searchTracks(query, {}, (err, data) => {
					if (!err) {
						const bestMatch = data.body.tracks.items[0];
						if (bestMatch) {
							const message = `ɴᴏᴡ ᴘʟᴀʏɪɴɢ: {bestMatch.name}\n─────⚪──────\n◄◄⠀▐▐ ⠀► 𝟸:𝟷𝟾 / 𝟹:𝟻𝟼\n───○ 🔊⠀ ᴴᴰ ⚙️`;
							const url = bestMatch.external_urls.spotify;
                            const preview = bestMatch.preview_url;
							if (preview) {
								request(preview).pipe(fs.createWriteStream(`${this.dirRoot}/media/temp.mp3}`)).on('close', (err, data) => {
									if (!err) {
										const audioMessage: fb.AttachmentMessage = {
											body: '',
											attachment: fs.createReadStream(`${this.dirRoot}/media/temp.mp3}`),
										};
										api.sendMessage(audioMessage, msg.threadID, (err, data) => {
											fs.unlink(`${this.dirRoot}/media/temp.mp3`, (err) => {
												console.log(err);
											});
										});
									} else {
										api.sendMessage('failed to download :(((((', msg.threadID);
									}
								});
							} else {
								api.sendMessage('no', msg.threadID);
							}
						}
					} else {
						console.log(err);
					}
				});
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
