"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
const transcriptScraper_1 = require("../scrapers/transcriptScraper");
const dbContext_1 = require("./dbContext");
function getAllRooms(req, res, next) {
    dbContext_1.database.any('SELECT * FROM rooms')
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
    dbContext_1.database.one('SELECT * FROM rooms WHERE room_id = $1', roomId)
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
    const roomId = parseInt(req.params.id);
    const date = moment('2017/08/31', 'YYYY/MM/DD');
    transcriptScraper_1.scrapeTranscriptPage(roomId, date, (scrapeError, scrapeData) => {
        if (scrapeError) {
            console.log(scrapeError);
            throw new scrapeError;
        }
        // Insert users into the db, omit copies
        dbContext_1.database.tx(t => {
            let queries = [];
            scrapeData.forEach((element) => {
                const query = t.none('INSERT INTO users(user_id, name) VALUES ($1, $2) ' +
                    'ON CONFLICT (user_id) DO NOTHING', [element.user_id, element.username]);
                queries.push(query);
            });
            return t.batch(queries);
        })
            .catch((err) => {
            console.log(err);
        });
        dbContext_1.database.tx(t => {
            let queries = [];
            scrapeData.forEach((element) => {
                const query = t.none('INSERT INTO rooms(room_id) VALUES ($1) ' +
                    'ON CONFLICT (room_id) DO NOTHING', [element.room_id]);
                queries.push(query);
            });
            return t.batch(queries);
        })
            .catch((err) => {
            console.log(err);
        });
    });
}
exports.postScrapeData = postScrapeData;
