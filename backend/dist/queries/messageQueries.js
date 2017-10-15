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
const promiseHelper_1 = require("../utility/promiseHelper");
const dbContext_1 = require("./dbContext");
const routerErrors_1 = require("../errors/routerErrors");
function getMessageById(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const messageId = parseInt(req.params.messageid);
        if (isNaN(messageId)) {
            throw new routerErrors_1.InvalidQueryError('message ID is not a number');
        }
        const [err, data] = yield promiseHelper_1.to(dbContext_1.database.oneOrNone('SELECT * FROM messages WHERE message_id = $1', [messageId]));
        if (err) {
            throw new routerErrors_1.DatabaseError(err);
        }
        if (data === null) {
            throw new routerErrors_1.NotFoundError('No messages were found');
        }
        return {
            status: 'success',
            data: data,
            message: `Retreived message of ID: ${messageId}`
        };
    });
}
exports.getMessageById = getMessageById;
function getMessages(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const roomId = parseInt(req.query.room);
        const userId = parseInt(req.query.user);
        const responseId = parseInt(req.query.response);
        const startDate = moment(req.query.startdate, 'YYYY-MM-DD');
        const endDate = moment(req.query.enddate, 'YYYY-MM-DD');
        const text = req.query.text;
        if (req.query.room !== undefined && isNaN(roomId)) {
            throw new routerErrors_1.InvalidQueryError('room ID is invalid');
        }
        if (req.query.user !== undefined && isNaN(userId)) {
            throw new routerErrors_1.InvalidQueryError('user ID is invalid');
        }
        if (req.query.response !== undefined && isNaN(responseId)) {
            throw new routerErrors_1.InvalidQueryError('response ID is invalid');
        }
        if (req.query.startdate !== undefined && !startDate.isValid()) {
            throw new routerErrors_1.InvalidQueryError('start date is invalid');
        }
        if (req.query.enddate !== undefined && !endDate.isValid()) {
            throw new routerErrors_1.InvalidQueryError('end date is invalid');
        }
        if (startDate.isValid() && !endDate.isValid() ||
            !startDate.isValid() && endDate.isValid()) {
            throw new routerErrors_1.InvalidQueryError('either both or none of start date and end date are required');
        }
        if (startDate.isValid() && endDate.isValid()) {
            if (startDate > endDate) {
                throw new routerErrors_1.InvalidQueryError('start date must come before end date');
            }
        }
        const query = getMessagesQuery(roomId, userId, responseId, startDate, endDate);
        const [err, data] = yield promiseHelper_1.to(dbContext_1.database.manyOrNone(query));
        if (err) {
            throw new routerErrors_1.DatabaseError(err);
        }
        return {
            status: 'success',
            data: data,
            message: `Retrieved ${data.length} messages`
        };
    });
}
exports.getMessages = getMessages;
function getMessagesQuery(roomId, userId, responseId, startDate, endDate) {
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
function filterMessages(messages, text) {
}
