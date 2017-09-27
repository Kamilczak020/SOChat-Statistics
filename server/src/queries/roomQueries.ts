import * as promise from 'bluebird';
import * as pgPromise from 'pg-promise';
import * as moment from 'moment';
import { Request, Response, NextFunction } from 'express';
import { scrapeTranscriptPage } from '../scrapers/transcriptScraper';
import { database as db, pgpromise as pgp} from './dbContext';
import { NotFoundError, InvalidQueryError } from '../errors/routerErrors';

export async function getAllRooms(req: Request) {
    const data = await db.any('SELECT * FROM rooms')
    
    if (data.length === 0) {
        throw new NotFoundError('No stored rooms were found');
    } 

    return {
        status: 'sucess',
        data: data,
        message: `Retrieved ${data.length} rooms.`
    };
}

export async function getAllMessages(req: Request) {
    const roomId = parseInt(req.params.roomid);
    const data = await db.manyOrNone('SELECT * FROM messages WHERE room_id = $1', roomId);

    if (data.length === 0) {
        throw new NotFoundError(`No stored messages for room with id ${roomId} were found`);
    }

    return {
        status: 'success',
        data: data,
        message: `Retrieved ${data.length} messages`
    };
}

export async function getMessageById(req: Request) {
    const roomId = parseInt(req.params.roomid);
    const messageId = parseInt(req.params.messageid);
    const data = await db.manyOrNone('SELECT * FROM messages WHERE room_id = $1 AND message_id = $2', [roomId, messageId])
    
    if (data.length === 0) {
        throw new NotFoundError(`Message of id: ${messageId} was not found`);
    }

    return {
        status: 'success',
        data: data,
        message: `Retrieved message of id: ${messageId}`
    };
}

export async function getSearchResult(req: Request) {
    const roomId = parseInt(req.params.roomid);
    const text = req.query.text;
    const timestamp = moment(req.query.timestamp, 'YYYY-MM-DD');

    if (text.length === 0) {
        throw new InvalidQueryError('The search query is empty');
    } 

    if (!timestamp.isValid()) {
        throw new InvalidQueryError('The timestamp query parameter is not valid.');
    }
    
    const year = timestamp.year;
    const month = timestamp.month;
    const day = timestamp.day;


    
}