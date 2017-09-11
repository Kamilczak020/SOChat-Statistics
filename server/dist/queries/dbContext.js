"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const promise = require("bluebird");
const pgPromise = require("pg-promise");
class DatabaseContext {
    constructor() {
        // Init & connection options
        const connectionJSON = require('../../dbconfig.json');
        const connectionOptions = connectionJSON;
        const initOptions = {
            promiseLib: promise,
        };
        // Instantiate pg-promise with bluebird
        let pgp = pgPromise(initOptions);
        this.database = pgp(connectionOptions);
    }
}
const databaseContext = new DatabaseContext();
exports.database = databaseContext.database;
exports.pgpromise = databaseContext.pgpromise;
