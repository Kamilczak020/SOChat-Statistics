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
const dbContext_1 = require("./dbContext");
const routerErrors_1 = require("../errors/routerErrors");
function getAllRooms(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield dbContext_1.database.any('SELECT * FROM rooms');
        if (data.length === 0) {
            throw new routerErrors_1.NotFoundError('No stored rooms were found');
        }
        return {
            status: 'sucess',
            data: data,
            message: `Retrieved ${data.length} rooms.`
        };
    });
}
exports.getAllRooms = getAllRooms;
function getAllMessages(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const roomId = parseInt(req.params.roomid);
        const data = yield dbContext_1.database.manyOrNone('SELECT * FROM messages WHERE room_id = $1', roomId);
        if (data.length === 0) {
            throw new routerErrors_1.NotFoundError(`No stored messages for room with id ${roomId} were found`);
        }
        return {
            status: 'success',
            data: data,
            message: `Retrieved ${data.length} messages`
        };
    });
}
exports.getAllMessages = getAllMessages;
function getMessageById(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const roomId = parseInt(req.params.roomid);
        const messageId = parseInt(req.params.messageid);
        const data = yield dbContext_1.database.manyOrNone('SELECT * FROM messages WHERE room_id = $1 AND message_id = $2', [roomId, messageId]);
        if (data.length === 0) {
            throw new routerErrors_1.NotFoundError(`Message of id: ${messageId} was not found`);
        }
        return {
            status: 'success',
            data: data,
            message: `Retrieved message of id: ${messageId}`
        };
    });
}
exports.getMessageById = getMessageById;
function getSearchResult(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const roomId = parseInt(req.params.roomid);
        const text = req.query.text;
        const timestamp = moment(req.query.timestamp, 'YYYY-MM-DD');
        if (text.length === 0) {
            throw new routerErrors_1.InvalidQueryError('The search query is empty');
        }
        if (!timestamp.isValid()) {
            throw new routerErrors_1.InvalidQueryError('The timestamp query parameter is not valid.');
        }
        const year = timestamp.year;
        const month = timestamp.month;
        const day = timestamp.day;
    });
}
exports.getSearchResult = getSearchResult;
