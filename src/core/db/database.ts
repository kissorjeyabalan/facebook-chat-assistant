class MongoClient {
    private static instance: MongoClient = new MongoClient();

    public tempVar: number;

    private constructor() {
        if (MongoClient.instance) {
            throw new Error('Error: MongoClient already exists.');
        }
        MongoClient.instance = this;
    }

    // tslint:disable-next-line:function-name
    public static getInstance(): MongoClient {
        return MongoClient.instance;
    }
}
