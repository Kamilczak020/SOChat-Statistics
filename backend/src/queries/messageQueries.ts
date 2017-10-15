import * as promise from 'bluebird';
import * as pgPromise from 'pg-promise';
import * as moment from 'moment';
import { to } from '../utility/promiseHelper';
import { Request } from 'express';
import { database as db, pgpromise as pgp} from './dbContext';
import { NotFoundError, DatabaseError, InvalidQueryError } from '../errors/routerErrors';

export async function getMessageById(req: Request) {
    const messageId = parseInt(req.params.messageid);

    if (isNaN(messageId)) {
        throw new InvalidQueryError('message ID is not a number');
    }

    const [err, data] = await to(db.oneOrNone(
        'SELECT * FROM messages WHERE message_id = $1', [messageId]));

    if (err) {
        throw new DatabaseError(err);
    }

    if (data === null) {
        throw new NotFoundError('No messages were found');
    }

    return {
        status: 'success',
        data: data,
        message: `Retreived message of ID: ${messageId}`
    }
}

export async function getMessages(req: Request) {
    const roomId = parseInt(req.query.room);
    const userId = parseInt(req.query.user);
    const responseId = parseInt(req.query.response);
    const startDate = moment(req.query.startdate, 'YYYY-MM-DD');
    const endDate = moment(req.query.enddate, 'YYYY-MM-DD');
    const text = req.query.text;

    if (req.query.room !== undefined && isNaN(roomId)) {
        throw new InvalidQueryError('room ID is invalid');
    }

    if (req.query.user !== undefined && isNaN(userId)) {
        throw new InvalidQueryError('user ID is invalid');
    }

    if (req.query.response !== undefined && isNaN(responseId)) {
        throw new InvalidQueryError('response ID is invalid');
    }

    if (req.query.startdate !== undefined && !startDate.isValid()) {
        throw new InvalidQueryError('start date is invalid');
    }

    if (req.query.enddate !== undefined && !endDate.isValid()) {
        throw new InvalidQueryError('end date is invalid');
    }

    if(startDate.isValid() && !endDate.isValid() ||
        !startDate.isValid() && endDate.isValid()) {
            throw new InvalidQueryError('either both or none of start date and end date are required');
    }

    if (startDate.isValid() && endDate.isValid()) {
        if (startDate > endDate) {
            throw new InvalidQueryError('start date must come before end date');
        }
    }

    const query = getMessagesQuery(roomId, userId, responseId, startDate, endDate);
    const [err, data] = await to(db.manyOrNone(query));

    if (err) {
        throw new DatabaseError(err);
    }

    return {
        status: 'success',
        data: data,
        message: `Retrieved ${data.length} messages`
    }
    
}

function getMessagesQuery(roomId: number, userId: number, responseId: number, startDate: moment.Moment, endDate: moment.Moment) {
    let query = 'SELECT * FROM messages';
    let queryObjects = [];

    if (!isNaN(roomId)) {
        queryObjects.push(`room_id = ${roomId}`);
    }

    if (!isNaN(userId)) {
        queryObjects.push(`user_id = ${userId}`);
    }

    if (!isNaN(responseId)) {
        queryObjects.push(`response_id = ${responseId}`);
    }

    if (startDate.isValid() && endDate.isValid()) {
        queryObjects.push(`date::date >= '${startDate.format('YYYY-MM-DD')}'`);
        queryObjects.push(`date::date <= '${endDate.format('YYYY-MM-DD')}'`);
    }


    if (queryObjects.length === 0) {
        return query;
    }

    query += ' WHERE ';
    query += queryObjects.join(' AND ');

    return query;
}

function filterMessages(messages: any[], text: string) {
    
}