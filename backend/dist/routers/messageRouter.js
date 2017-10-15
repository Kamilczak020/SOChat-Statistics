"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const apiMethod_1 = require("./apiMethod");
const messageQueries_1 = require("../queries/messageQueries");
/**
 * Router used for '/rooms' route, providing access
 * to all stored rooms and particular room info.
 */
class MessageRouter {
    constructor() {
        this.router = express_1.Router();
        this.init();
    }
    // Define routing behavior and attach db queries
    init() {
        this.router.get('/', apiMethod_1.apiMethod(messageQueries_1.getMessages));
        this.router.get('/:messageid', apiMethod_1.apiMethod(messageQueries_1.getMessageById));
    }
}
exports.MessageRouter = MessageRouter;
// Create the RoomRouter, and export its configured Express.Router
const messageRouter = new MessageRouter();
messageRouter.init();
exports.default = messageRouter.router;
