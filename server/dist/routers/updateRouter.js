"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const updateQueries_1 = require("../queries/updateQueries");
const apiMethod_1 = require("./apiMethod");
/**
 * Router used for '/update' route, providing access
 * to updating the database from the transcript scrape.
 */
class UpdateRouter {
    constructor() {
        this.router = express_1.Router();
        this.init();
    }
    // Define routing behavior and attach db queries
    init() {
        this.router.post('/rooms/:roomid', apiMethod_1.apiMethod(updateQueries_1.postFromScrapeData));
    }
}
exports.UpdateRouter = UpdateRouter;
// Create the UpdateRouter, and export its configured Express.Router
const updateRouter = new UpdateRouter();
updateRouter.init();
exports.default = updateRouter.router;
