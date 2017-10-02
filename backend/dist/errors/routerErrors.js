"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const make_error_1 = require("make-error");
class NotFoundError extends make_error_1.BaseError {
    constructor(message) {
        super(message);
        this.status = 404;
    }
}
exports.NotFoundError = NotFoundError;
class InvalidQueryError extends make_error_1.BaseError {
    constructor(message) {
        super(message);
        this.status = 400;
    }
}
exports.InvalidQueryError = InvalidQueryError;
class ScrapeError extends make_error_1.BaseError {
    constructor(message) {
        super(message);
        this.status = 500;
    }
}
exports.ScrapeError = ScrapeError;
class DatabaseError extends make_error_1.BaseError {
    constructor(message) {
        super(message);
        this.status = 500;
    }
}
exports.DatabaseError = DatabaseError;
class UnauthorizedError extends make_error_1.BaseError {
    constructor(message) {
        super(message);
        this.status = 401;
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends make_error_1.BaseError {
    constructor(message) {
        super(message);
        this.status = 403;
    }
}
exports.ForbiddenError = ForbiddenError;
