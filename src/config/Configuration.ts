import * as brototype from 'brototype';
import * as fs from 'fs';
import * as yml from 'js-yaml';

export class Configuration {
    private static instance: Configuration = new Configuration();

    private configPath: string;
    // tslint:disable-next-line:no-any
    private bro: any;

    constructor(path: string = './config.yml') {
        if (Configuration.instance) {
            throw Error('Configuration is already initialized.');
        }
        //this.configPath = path;
        const config = yml.safeLoad(fs.readFileSync(path, 'utf-8'));
        this.bro = brototype(config);
        Configuration.instance = this;
    }

    // tslint:disable-next-line:function-name
    public static getInstance(): Configuration {
        return this.instance;
    }

    public has(prop: string): boolean {
        return this.bro.doYouEven(prop);
    }

    // tslint:disable-next-line:no-any
    public fetch(prop: string): any {
        if (this.has(prop)) {
            return this.bro.iCanHaz(prop);
        } else {
            throw new Error(`Property ${prop} was not found in ${this.configPath}`);
        }
    }

}
