"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
class ConnectionManager {
    constructor() {
        if (ConnectionManager.instance) {
            throw Error('Error: ConnectionManager already exists.');
        }
        ConnectionManager.instance = this;
    }
    // tslint:disable-next-line:function-name
    static getInstance() {
        return ConnectionManager.instance;
    }
    openConnection() {
        if (this.connection === undefined) {
            mongoose.connect('mongodb://localhost/test');
            this.connection = mongoose.connection;
        }
    }
    closeConnection() {
        if (this.connection !== undefined) {
            mongoose.connection.close();
            this.connection = undefined;
        }
    }
    getConnection() {
        if (this.connection === undefined) {
            this.openConnection();
        }
        return this.connection;
    }
}
ConnectionManager.instance = new ConnectionManager();
exports.ConnectionManager = ConnectionManager;
//# sourceMappingURL=ConnectionManager.js.map