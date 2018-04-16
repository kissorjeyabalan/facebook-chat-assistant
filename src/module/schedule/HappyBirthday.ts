import * as fb from 'facebook-chat-api';
import * as ns from 'node-schedule';
import { Global } from '../../Global';
import Schedule from '../Schedule';

export default class HappyBirthday extends Schedule {
  private dirRoot: string = `${__dirname}/../..`;
  public start(): void {
    console.log("current time: " + new Date().getHours());
    const date1 = new Date(2018, 3, 14, 0, 2);
    const date2 = new Date(2018, 3, 22, 10, 2);
    const p1 = ns.scheduleJob(date1, () => {
      const api: fb.Api = Global.getInstance().getApi();
      const hpmsg: any = {
        body: 'Happy Birthday, Casey! 23? Is that right? Wow. Nice. I am truly impressed that you\'ve managed to survive so long. Do you want some money or something for your exceptional accomplishment?',
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

   const p3 = ns.scheduleJob(new Date(2018, 3, 13, 17, 5), () => {
     const api: fb.Api = Global.getInstance().getApi();
     api.sendMessage('hello', '1420517794899222');
   });
  }
}
