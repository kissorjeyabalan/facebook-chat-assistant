import Handler from './Handler';

export default class HandlerSecond extends Handler {
    public handle(message: string): any {
        console.log(`Handler second ran: ${message}`);

        return message;
    }
}
