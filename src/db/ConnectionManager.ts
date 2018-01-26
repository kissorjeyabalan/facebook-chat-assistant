import * as mongoose from 'mongoose';
import { Configuration } from '../config/Configuration';

export class ConnectionManager {
    private static instance: ConnectionManager = new ConnectionManager();
    private config: Configuration;
    private connection: mongoose.Connection;

    private constructor() {
        if (ConnectionManager.instance) {
            throw Error('Error: ConnectionManager already exists.');
        }
        this.config = new Configuration();
        ConnectionManager.instance = this;
    }

    // tslint:disable-next-line:function-name
    public static getInstance(): ConnectionManager {
        return ConnectionManager.instance;
    }

    public openConnection(): void {
        if (this.connection === undefined) {
            const host: string = this.config.fetch('mongoose.host');
            const port: string = this.config.fetch('mongoose.port');
            const database: string = this.config.fetch('mongoose.database');
            mongoose.connect(`mongodb://${host}:${port}/${database}`, { useMongoClient: true });
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
