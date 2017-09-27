"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const makeError = require("make-error");
exports.NotFoundError = makeError('Resource not found');
exports.RoutingError = makeError('Routing error');
exports.InvalidQueryError = makeError('Invalid query');
exports.ScrapeError = makeError('Scraping error');
