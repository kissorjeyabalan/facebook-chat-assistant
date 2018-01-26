/// <reference types="mongoose" />
import * as mongoose from 'mongoose';
export declare class ConnectionManager {
    private static instance;
    private connection;
    private constructor();
    static getInstance(): ConnectionManager;
    openConnection(): void;
    closeConnection(): void;
    getConnection(): mongoose.Connection;
}
