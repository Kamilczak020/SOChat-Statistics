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
function postFromScrapeData(req, res, next) {
    const roomId = parseInt(req.params.id);
    const date = moment('2017/08/31', 'YYYY/MM/DD');
    transcriptScraper_1.scrapeTranscriptPage(roomId, date, (scrapeError, scrapeData) => {
        if (scrapeError) {
            console.log(scrapeError);
        }
        // Build our queries arrays based on scrape data
        const roomsQueries = getRoomsQueries(scrapeData);
        const usersQueries = getUsersQueries(scrapeData);
        const roomsUsersQueries = getRoomsUsersQueries(scrapeData);
        const messagesQueries = getMessagesQueries(scrapeData);
        // Execute promises
        Promise.all(getPromises(roomsQueries))
            .then(() => Promise.all(getPromises(usersQueries)))
            .then(() => Promise.all(getPromises(roomsUsersQueries)))
            .then(() => Promise.all(getPromises(messagesQueries)))
            .then(() => {
            res.status(200)
                .json({
                status: 'success',
                message: `scrape data for ${date} inserted sucessfully.`
            });
        })
            .catch((error) => {
            console.log(error);
        });
    });
}
exports.postFromScrapeData = postFromScrapeData;
// Promises
function getPromises(queries) {
    const promises = queries.map((query) => {
        return db.none(query);
    });
    return promises;
}
// Queries for promises
function getUsersQueries(scrapeData) {
    let queries = [];
    scrapeData.forEach((msg) => {
        const query = new pgp.ParameterizedQuery(`INSERT INTO users(
                user_id, 
                name) 
            VALUES($1, $2) 
            ON CONFLICT(user_id) 
            DO UPDATE SET name = $2`, [msg.user_id, msg.username]);
        queries.push(query);
    });
    return queries;
}
function getRoomsQueries(scrapeData) {
    let queries = [];
    scrapeData.forEach((msg) => {
        const query = new pgp.ParameterizedQuery(`INSERT INTO rooms(room_id) 
            VALUES($1) 
            ON CONFLICT(room_id) 
            DO NOTHING`, [msg.room_id]);
        queries.push(query);
    });
    return queries;
}
function getRoomsUsersQueries(scrapeData) {
    let queries = [];
    scrapeData.forEach((msg) => {
        const query = new pgp.ParameterizedQuery(`INSERT INTO roomsusers(
                room_id, 
                user_id) 
            VALUES($1, $2) 
            ON CONFLICT(
                room_id, 
                user_id) 
            DO NOTHING`, [msg.room_id,
            msg.user_id]);
        queries.push(query);
    });
    return queries;
}
function getMessagesQueries(scrapeData) {
    let queries = [];
    scrapeData.forEach((msg) => {
        const query = new pgp.ParameterizedQuery(`INSERT INTO messages(
                message_id, 
                user_id, 
                room_id, 
                response_id, 
                body, 
                timestamp, 
                stars) 
            VALUES($1, $2, $3, $4, $5, $6, $7) 
            ON CONFLICT(message_id) 
            DO NOTHING`, [msg.message_id,
            msg.user_id,
            msg.room_id,
            msg.response_id,
            msg.body,
            msg.timestamp,
            msg.stars]);
        queries.push(query);
    });
    return queries;
}
