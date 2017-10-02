"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const promise = require("bluebird");
const pgPromise = require("pg-promise");
// Init & connection options
const connectionJSON = require('../../dbconfig.json');
const connectionOptions = connectionJSON;
const initOptions = {
    promiseLib: promise,
};
// Instantiate pg-promise with bluebird
let pgp = pgPromise(initOptions);
// Create db connection with connection string
let db = pgp(connectionOptions);
