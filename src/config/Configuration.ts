import * as fs from 'fs';
import * as yml from 'js-yaml';

export class Configuration {
    private static instance: Configuration = new Configuration();

    private configPath: string;
    // tslint:disable-next-line:no-any
    private config: any;

    constructor(path: string = './config.yml') {
        if (Configuration.instance) {
            throw Error('Configuration is already initialized.');
        }
        //this.configPath = path;
        this.config = yml.safeLoad(fs.readFileSync(path, 'utf-8'));
        Configuration.instance = this;
    }

    // tslint:disable-next-line:function-name
    public static getInstance(): Configuration {
        return this.instance;
    }

    public has(prop: string): boolean {
        const split = prop.split('.');
        let thing = this.config;
        try {
            for (const e of split) {
                thing = thing[e];
            }
        } catch {
            return false;
        }

        return true;
    }

    // tslint:disable-next-line:no-any
    public fetch(prop: string): any {
        if (this.has(prop)) {
            const split = prop.split('.');
            let thing = this.config;
            for (const e of split) {
                thing = thing[e];
            }

            return thing;
        } else {
            throw new Error(`Property ${prop} was not found in ${this.configPath}`);
        }
    }

    public hasAppState(): boolean {
        return fs.existsSync(this.fetch('account.state'));
    }

    public getAppState(): any {
        return JSON.parse(fs.readFileSync(this.fetch('account.state'), 'utf-8'));
    }

    public isCmdEnabled(cmd: string): boolean {
        try {
            return this.fetch(`commands.${cmd}.enabled`);
        } catch {
            return true;
        }
    }

    public getRegexFromMembers(names: string[]): string {
        let regstr = '(';

        for (const name of names) {
            regstr += name;
            regstr += '|';
        }
        regstr += 'me)';

        return regstr;
    }



}
