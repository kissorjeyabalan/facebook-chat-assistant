import * as fb from 'facebook-chat-api';
import * as ns from 'node-schedule';
import { Global } from '../../Global';
import Schedule from '../Schedule';

export default class HappyBirthday extends Schedule {
  private dirRoot: string = `${__dirname}/../..`;
  public start(): void {
    const date1 = new Date(2018, 4, 14, 10, 2);
    const date2 = new Date(2018, 4, 22, 10, 2);
    const p1 = ns.scheduleJob(date1, () => {
      const api: fb.Api = Global.getInstance().getApi();
      const hpmsg: any = {
        body: 'Happy Birthday, Casey! 23 is pretty old, man. Get your life together. Oh, no. I am the one who needs to get it together, not you. Sorry. Forgive me.',
        mentions: [{
          tag: 'Casey',
          id: 1616826839,
        }],
      };
      api.sendMessage(hpmsg, '1420517794899222');
    });

    const p2 = ns.scheduleJob(date2, () => {
      const api: fb.Api = Global.getInstance().getApi();
      const hpmsg: any = {
        body: 'Happy Birthday, Synne! 23 already? Wow. Sad.',
        mentions: [{
          tag: 'Synne',
          id: 584111931,
        }],
      };
      api.sendMessage(hpmsg, '1420517794899222');
    });
  }
}
