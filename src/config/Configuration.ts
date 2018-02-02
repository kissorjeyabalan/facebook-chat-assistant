import * as fs from 'fs';
import * as yml from 'js-yaml';
import * as dash from 'lodash';

export class Configuration {
    private static instance: Configuration = new Configuration();

    private configPath: string;
    // tslint:disable-next-line:no-any
    private config: any;

    constructor(path: string = './config.yml') {
        if (Configuration.instance) {
            throw Error('Configuration is already initialized.');
        }

        const config = yml.safeLoad(fs.readFileSync(path, 'utf-8'));
        this.configPath = path;
        this.config = config;
        Configuration.instance = this;
    }

    // tslint:disable-next-line:function-name
    public static getInstance(): Configuration {
        return this.instance;
    }

    public has(prop: string): boolean {
        return dash.has(this.config, prop);
    }

    // tslint:disable-next-line:no-any
    public fetch(prop: string): any {
        if (this.has(prop)) {
            return dash.get(this.config, prop);
        } else {
            throw new Error(`Property ${prop} was not found in ${this.configPath}`);
        }
    }

    public remove(prop: string) {
        const success: boolean = dash.unset(this.config, prop);
        if (success) {
            const temp = yml.safeDump(this.config);
            fs.writeFileSync(this.configPath, temp, 'utf-8');

            return true;
        }

        return false;
    }

    public add(prop: string, value: any) {
        const success: boolean = dash.set(this.config, prop, value);
        if (success) {
            const temp = yml.safeDump(this.config);
            fs.writeFileSync(this.configPath, temp, 'utf-8');

            return true;
        }

        return false;
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
