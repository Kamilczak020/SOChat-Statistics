"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
const transcriptScraper_1 = require("../scrapers/transcriptScraper");
const dbContext_1 = require("./dbContext");
const routerErrors_1 = require("../errors/routerErrors");
function postFromScrapeData(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const roomId = parseInt(req.params.roomid);
        const timestampQuery = req.query.timestamp;
        // Convert query timestamp string to a moment 
        const timestamp = moment(timestampQuery, "YYYY-MM-DD");
        // Check if timestamp is correct, if not return 400
        if (!timestamp.isValid()) {
            throw new routerErrors_1.InvalidQueryError('Timestamp is invalid');
        }
        // Run the scraper and provide results
        const scrapeData = yield transcriptScraper_1.scrapeTranscriptPage(roomId, timestamp);
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
            return {
                status: 'success',
                message: `Scrape data for ${timestamp} inserted sucessfully.`
            };
        });
    });
}
exports.postFromScrapeData = postFromScrapeData;
// Promises
function getPromises(queries) {
    const promises = queries.map((query) => {
        return dbContext_1.database.none(query);
    });
    return promises;
}
// Queries for promises
function getUsersQueries(scrapeData) {
    let queries = [];
    scrapeData.forEach((msg) => {
        const query = new dbContext_1.pgpromise.ParameterizedQuery(`INSERT INTO users(
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
        const query = new dbContext_1.pgpromise.ParameterizedQuery(`INSERT INTO rooms(room_id) 
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
        const query = new dbContext_1.pgpromise.ParameterizedQuery(`INSERT INTO roomsusers(
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
        const query = new dbContext_1.pgpromise.ParameterizedQuery(`INSERT INTO messages(
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
