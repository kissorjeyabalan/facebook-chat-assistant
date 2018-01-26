import * as brototype from 'brototype';
import * as fs from 'fs';
import * as yml from 'js-yaml';

export class Configuration {
    private configPath: string;
    // tslint:disable-next-line:no-any
    private bro: any;

    constructor(path: string = './config.yml') {
        //this.configPath = path;
        const config = yml.safeLoad(fs.readFileSync(path, 'utf-8'));
        this.bro = brototype(config);
    }

    public has(prop: string): boolean {
        return this.bro.doYouEven(prop);
    }

    public fetch(prop: string): string {
        if (this.has(prop)) {
            return this.bro.iCanHaz(prop);
        } else {
            throw new Error(`Property ${prop} was not found in ${this.configPath}`);
        }
    }

}
