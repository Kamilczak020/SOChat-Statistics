"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const roomRouter_1 = require("./routers/roomRouter");
const updateRouter_1 = require("./routers/updateRouter");
const passport_1 = require("./authentication/passport");
// Creates and configures an ExpressJS web server.
class App {
    //Run configuration methods on the Express instance.
    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
    }
    // Configure Express middleware.
    middleware() {
        this.express.use(logger('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(passport_1.passport.initialize());
    }
    // Configure API endpoints.
    routes() {
        let router = express.Router();
        router.get('/', (req, res, next) => {
            res.json({
                message: 'Hello World!'
            });
            router.get('/cars', (req, res, next) => {
                res.json({
                    message: 'wpw'
                });
            });
        });
        this.express.use('/', passport_1.passport.authenticate('localapikey', { session: false }), router);
        this.express.use('/rooms', roomRouter_1.default);
        this.express.use('/update', passport_1.passport.authenticate('localapikey', { session: false }), updateRouter_1.default);
    }
}
exports.default = new App().express;
