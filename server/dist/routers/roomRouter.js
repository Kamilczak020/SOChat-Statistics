"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const roomQueries_1 = require("../queries/roomQueries");
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
        this.router.get('/', roomQueries_1.getAllRooms);
        this.router.get('/:id/update', roomQueries_1.postScrapeData);
    }
}
exports.RoomRouter = RoomRouter;
// Create the RoomRouter, and export its configured Express.Router
const roomRouter = new RoomRouter();
roomRouter.init();
exports.default = roomRouter.router;
