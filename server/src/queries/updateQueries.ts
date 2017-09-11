import * as promise from 'bluebird';
import * as pgPromise from 'pg-promise';
import * as moment from 'moment';
import { Request, Response, NextFunction } from 'express';
import { scrapeTranscriptPage } from '../scrapers/transcriptScraper';
import { Message } from '../models/messageModel';

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

export function postFromScrapeData(req: Request, res: Response, next: NextFunction) {
    const roomId = parseInt(req.params.id);
    const timestampQuery = req.query.timestamp;

    // Check if timestamp is correct, if not return 400
    if (!moment(timestampQuery, "YYYY-MM-DD", true).isValid()) {
        res.status(400)
            .json({
                status: 'error',
                message: `Provided timestamp: ${timestampQuery} is invalid`
            })
        return;
    }

    // Convert query timestamp string to a moment 
    const timestamp = moment(timestampQuery, "YYYY-MM-DD");

    // Run the scraper and provide results
    scrapeTranscriptPage(roomId, timestamp, (scrapeError, scrapeData) => {
        if (scrapeError) {
            console.log(scrapeError);
            res.status(500)
                .json({
                    status: 'error',
                    message: 'The server encountered an unexpected condition during scraping, \
                        that prevented it from fullfilling the request.'
                })
            return;
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
                    message: `Scrape data for ${timestamp} inserted sucessfully.`
                });
        })
        .catch((error) => {
            console.log(error);
            res.status(500)
                .json({
                    status: 'error',
                    message: 'The server encountered an unexpected condition, \
                        that prevented it from fullfilling the request.'
                })
            return;
        })
    })
}

// Promises
function getPromises(queries: Array<pgPromise.ParameterizedQuery>): Promise<null>[] {
    const promises = queries.map((query) => {
        return db.none(query);
    })
    return promises;
}

// Queries for promises
function getUsersQueries(scrapeData: Array<Message>): Array<pgPromise.ParameterizedQuery> {
    let queries = [];
    scrapeData.forEach((msg) => {
        const query = new pgp.ParameterizedQuery(
            `INSERT INTO users(
                user_id, 
                name) 
            VALUES($1, $2) 
            ON CONFLICT(user_id) 
            DO UPDATE SET name = $2`, 
            [msg.user_id, msg.username]);
        queries.push(query);
    })
    return queries;
}

function getRoomsQueries(scrapeData: Array<Message>): Array<pgPromise.ParameterizedQuery> {
    let queries = [];
    scrapeData.forEach((msg) => {
        const query = new pgp.ParameterizedQuery(
            `INSERT INTO rooms(room_id) 
            VALUES($1) 
            ON CONFLICT(room_id) 
            DO NOTHING`,
            [msg.room_id]);

        queries.push(query);
    })
    return queries;
}

function getRoomsUsersQueries(scrapeData: Array<Message>): Array<pgPromise.ParameterizedQuery> {
    let queries = [];
    scrapeData.forEach((msg) => {
        const query = new pgp.ParameterizedQuery(
            `INSERT INTO roomsusers(
                room_id, 
                user_id) 
            VALUES($1, $2) 
            ON CONFLICT(
                room_id, 
                user_id) 
            DO NOTHING`,
            [msg.room_id,
            msg.user_id]);

        queries.push(query);
    })
    return queries;
}

function getMessagesQueries(scrapeData: Array<Message>): Array<pgPromise.ParameterizedQuery> {
    let queries = [];
    scrapeData.forEach((msg) => {
        const query = new pgp.ParameterizedQuery(
            `INSERT INTO messages(
                message_id, 
                user_id, 
                room_id, 
                response_id, 
                body, 
                timestamp, 
                stars) 
            VALUES($1, $2, $3, $4, $5, $6, $7) 
            ON CONFLICT(message_id) 
            DO NOTHING`,
            [msg.message_id, 
            msg.user_id,
            msg.room_id,
            msg.response_id,
            msg.body,
            msg.timestamp,
            msg.stars])

        queries.push(query);
    })
    return queries;
}