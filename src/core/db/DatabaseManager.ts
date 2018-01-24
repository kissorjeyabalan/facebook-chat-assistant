import { MongoConnector } from './MongoConnector';

export class DatabaseManager {
    private static instance: DatabaseManager = new DatabaseManager();

    private connector: MongoConnector;

    private constructor() {
        if (DatabaseManager.instance) {
            throw new Error('Error: MongoClient already exists.');
        }
        DatabaseManager.instance = this;
    }

    // tslint:disable-next-line:function-name
    public static getInstance(): DatabaseManager {
        return DatabaseManager.instance;
    }
}
