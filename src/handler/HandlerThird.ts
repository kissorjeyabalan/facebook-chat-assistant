import Handler from './Handler';

export default class HandlerThird extends Handler {
    public handle(message: string): any {
        console.log(`Handler third ran: ${message}`);

        return message;
    }
}
