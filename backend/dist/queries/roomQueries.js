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
const promiseHelper_1 = require("../utility/promiseHelper");
const dbContext_1 = require("./dbContext");
const routerErrors_1 = require("../errors/routerErrors");
function getAllRooms(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const [err, data] = yield promiseHelper_1.to(dbContext_1.database.any('SELECT * FROM rooms'));
        if (err) {
            throw new routerErrors_1.DatabaseError(err);
        }
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
