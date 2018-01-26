import * as mongoose from 'mongoose';

export class ConnectionManager {
    private static instance: ConnectionManager = new ConnectionManager();
    private connection: mongoose.Connection;

    private constructor() {
        if (ConnectionManager.instance) {
            throw Error('Error: ConnectionManager already exists.');
        }
        ConnectionManager.instance = this;
    }

    // tslint:disable-next-line:function-name
    public static getInstance(): ConnectionManager {
        return ConnectionManager.instance;
    }
    public openConnection(): void {
        if (this.connection === undefined) {
            mongoose.connect('mongodb://localhost/test');
            this.connection = mongoose.connection;
        }
    }

    public closeConnection(): void {
        if (this.connection !== undefined) {
            mongoose.connection.close();
            this.connection = undefined;
        }
    }

    public getConnection(): mongoose.Connection {
        if (this.connection === undefined) {
            this.openConnection();
        }

        return this.connection;
    }
}
