import * as fb from 'facebook-chat-api';
import * as ns from 'node-schedule';
import { Global } from '../../Global';
import Schedule from '../Schedule';

export default class HappyBirthday extends Schedule {
  private dirRoot: string = `${__dirname}/../..`;
  public start(): void {
    const date1 = new Date(2018, 5, 11, 9, 42);
    const p1 = ns.scheduleJob(date1, () => {
      const api: fb.Api = Global.getInstance().getApi();
      const hpmsg: any = {
        body: 'Gratulerer med dagen, Pål Anders! 23? Wow.',
        mentions: [{
          tag: 'Pål Anders',
          id: 1188608529,
        }],
      };
      api.sendMessage(hpmsg, '1379335532192738');
    });
  }
}
