"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const promise = require("bluebird");
const pgPromise = require("pg-promise");
const moment = require("moment");
const transcriptScraper_1 = require("../scrapers/transcriptScraper");
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
function getAllRooms(req, res, next) {
    db.any('SELECT * FROM rooms')
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
function getRoomById(req, res, next) {
    let roomId = parseInt(req.params.id);
    db.one('SELECT * FROM rooms WHERE room_id = $1', roomId)
        .then((data) => {
        res.status(200)
            .json({
            status: 'sucess',
            data: data,
            message: `Retrieved room of id: ${roomId}`
        });
    })
        .catch((err) => {
        return next(err);
    });
}
exports.getRoomById = getRoomById;
function postScrapeData(req, res, next) {
    const roomId = 17;
    const date = moment('2017/08/31', 'YYYY/MM/DD');
    transcriptScraper_1.scrapeTranscriptPage(roomId, date, (scrapeError, scrapeData) => {
        if (scrapeError) {
            console.log(scrapeError);
            throw new scrapeError;
        }
        // Generate an instert query from our array.
        const query = pgp.helpers.insert(scrapeData, ['message_id', 'user_id', 'response_message_id',
            'room_id', 'text', 'datetime', 'stars'], 'messages');
        const obj = {
            resp: null,
            star: 0
        };
        db.none("INSERT INTO users(user_id, name) VALUES(123, 'kamil')");
        db.none("INSERT INTO rooms(room_id, name, description) VALUES(15, 'myroom', 'this is stupid')");
        db.none("INSERT INTO messages(message_id, user_id, response_message_id, room_id, text, datetime, stars) VALUES(123, 123, ${resp}, 15, 'wolololo', '2017-08-30', ${star})", obj)
            .then((data) => {
            res.status(200)
                .json({
                status: 'sucess',
                data: data,
                message: 'wow it works somehow'
            });
        })
            .catch((err) => {
            return next(err);
        });
    });
}
exports.postScrapeData = postScrapeData;
