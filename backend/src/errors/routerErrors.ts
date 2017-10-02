import { BaseError } from 'make-error';

export class NotFoundError extends BaseError {
    public status = 404;
    
    constructor (message?: string) {
        super(message);
      }
}

export class InvalidQueryError extends BaseError {
    public status = 400;
    
    constructor (message?: string) {
        super(message);
      }
}

export class ScrapeError extends BaseError {
    public status = 500;
    
    constructor (message?: string) {
        super(message);
      }
}

export class DatabaseError extends BaseError {
    public status = 500;
    
    constructor (message?: string) {
        super(message);
      }
}

export class UnauthorizedError extends BaseError {
    public status = 401;
    
    constructor (message?: string) {
        super(message);
      }
}

export class ForbiddenError extends BaseError {
    public status = 403;
    
    constructor (message?: string) {
        super(message);
      }
}
