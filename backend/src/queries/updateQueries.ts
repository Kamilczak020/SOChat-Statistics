import * as promise from 'bluebird';
import * as pgPromise from 'pg-promise';
import * as moment from 'moment';
import { to } from '../utility/promiseHelper';
import { Request, Response, NextFunction } from 'express';
import { scrapeTranscriptPage } from '../scrapers/transcriptScraper';
import { database as db, pgpromise as pgp } from './dbContext';
import { InvalidQueryError, NotFoundError, ScrapeError } from '../errors/routerErrors';
import { Message } from '../models/messageModel';


export async function postFromScrapeData(req: Request) {
    const roomId = parseInt(req.params.roomid);
    const date = moment(req.params.date, "YYYY-MM-DD");

    // Check if timestamp is correct, if not return 400
    if (!date.isValid()) {
        throw new InvalidQueryError('date is invalid');
    }    

    // Run the scraper and provide results
    const [err, scrapeData] = await to(scrapeTranscriptPage(roomId, date));
    
    if (err) {
        throw new ScrapeError(err);
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
        return {
            status: 'success',
            message: `Scrape data for ${date} inserted sucessfully.`
        };
    })
}

// Promises
function getPromises(queries: pgPromise.ParameterizedQuery[]): Promise<null>[] {
    const promises = queries.map((query) => {
        return db.none(query);
    })
    
    return promises;
}

// Queries for promises
function getUsersQueries(scrapeData: Message[]): pgPromise.ParameterizedQuery[] {
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

function getRoomsQueries(scrapeData: Message[]): pgPromise.ParameterizedQuery[] {
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

function getRoomsUsersQueries(scrapeData: Message[]): pgPromise.ParameterizedQuery[] {
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

function getMessagesQueries(scrapeData: Message[]): pgPromise.ParameterizedQuery[] {
    let queries = [];
    scrapeData.forEach((msg) => {
        const query = new pgp.ParameterizedQuery(
            `INSERT INTO messages(
                message_id, 
                user_id, 
                room_id, 
                response_id, 
                body, 
                date, 
                stars) 
            VALUES($1, $2, $3, $4, $5, $6, $7) 
            ON CONFLICT(message_id) 
            DO NOTHING`,
            [msg.message_id, 
            msg.user_id,
            msg.room_id,
            msg.response_id,
            msg.body,
            msg.date,
            msg.stars])

        queries.push(query);
    })
    return queries;
}