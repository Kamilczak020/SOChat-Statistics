import * as moment from 'moment';
import { Router, Request, Response, NextFunction } from 'express';
import { passport } from '../authentication/passport';
import { apiMethod } from './apiMethod';
import { getMessages, getMessageById } from '../queries/messageQueries';

/**
 * Router used for '/rooms' route, providing access
 * to all stored rooms and particular room info.
 */
export class MessageRouter {
    router: Router
  
    constructor() {
      this.router = Router();
      this.init();
    }

    // Define routing behavior and attach db queries
    init() {
        this.router.get('/', apiMethod(getMessages));
        this.router.get('/:messageid', apiMethod(getMessageById));
    }
}

// Create the RoomRouter, and export its configured Express.Router
const messageRouter = new MessageRouter();
messageRouter.init();

export default messageRouter.router;