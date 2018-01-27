import Handler from './Handler';

export default class HandlerFirst extends Handler {
    public handle(message: string): any {
        console.log(`Handler first ran: ${message}`);

        return message;
    }
}
