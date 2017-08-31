"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const promise = require("bluebird");
const pgPromise = require("pg-promise");
// Init & connection options
const initOptions = {
    promiseLib: promise,
};
const connectionOptions = {
    host: 'localhost',
    port: 5432,
    database: 'sochat',
    user: 'postgres',
    password: 'Kaka1337#'
};
// Initialize pg-promise with bluebird
let pgp = pgPromise(initOptions);
// Create db connection with connection string
let db = pgp(connectionOptions);
function getAllRooms(req, res, next) {
    db.any('select * from Rooms')
        .then((data) => {
        let roomCount = data.length;
        res.status(200)
            .json({
            status: 'sucess',
            data: data,
            message: `Retrieved ${roomCount} rooms.`
        });
    })
        .catch((err) => {
        return next(err);
    });
}
exports.getAllRooms = getAllRooms;
