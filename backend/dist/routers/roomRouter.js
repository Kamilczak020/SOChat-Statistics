"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const roomQueries_1 = require("../queries/roomQueries");
const apiMethod_1 = require("./apiMethod");
/**
 * Router used for '/rooms' route, providing access
 * to all stored rooms and particular room info.
 */
class RoomRouter {
    constructor() {
        this.router = express_1.Router();
        this.init();
    }
    // Define routing behavior and attach db queries
    init() {
        this.router.get('/', apiMethod_1.apiMethod(roomQueries_1.getAllRooms));
        this.router.get('/:roomid/messages', apiMethod_1.apiMethod(roomQueries_1.getAllMessages));
        this.router.get('/:roomid/messages/:messageid', apiMethod_1.apiMethod(roomQueries_1.getMessageById));
        this.router.get('/:roomid/messages/search');
    }
}
exports.RoomRouter = RoomRouter;
// Create the RoomRouter, and export its configured Express.Router
const roomRouter = new RoomRouter();
roomRouter.init();
exports.default = roomRouter.router;
