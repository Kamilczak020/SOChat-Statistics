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
let pgp = pgPromise(initOptions);
let db = pgp(connectionOptions);
class RoomQueries {
    getAllRooms(req, res, next) {
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
}
exports.RoomQueries = RoomQueries;
