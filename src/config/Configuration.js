"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const brototype = require("brototype");
const fs = require("fs");
const yml = require("js-yaml");
class Configuration {
    constructor(path = 'config.yml') {
        //this.configPath = path;
        const config = yml.safeLoad(fs.readFileSync(path, 'utf-8'));
        this.bro = brototype(config);
    }
    has(prop) {
        return this.bro.doYouEven(prop);
    }
}
exports.Configuration = Configuration;
//# sourceMappingURL=Configuration.js.map