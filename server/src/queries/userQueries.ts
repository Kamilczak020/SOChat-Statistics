import * as promise from 'bluebird';
import * as pgPromise from 'pg-promise';
import * as moment from 'moment';
import { Request, Response, NextFunction } from 'express';

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

