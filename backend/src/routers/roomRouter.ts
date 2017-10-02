import * as moment from 'moment';
import { Router, Request, Response, NextFunction } from 'express';
import { getAllRooms, getAllMessages, getMessageById } from '../queries/roomQueries';
import { passport } from '../authentication/passport';
import { apiMethod } from './apiMethod';

/**
 * Router used for '/rooms' route, providing access
 * to all stored rooms and particular room info.
 */
export class RoomRouter {
    router: Router
  
    constructor() {
      this.router = Router();
      this.init();
    }

    // Define routing behavior and attach db queries
    init() {
        this.router.get('/', apiMethod(getAllRooms));
        this.router.get('/:roomid/messages', apiMethod(getAllMessages));
        this.router.get('/:roomid/messages/:messageid', apiMethod(getMessageById));
        this.router.get('/:roomid/messages/search');
    }
}

// Create the RoomRouter, and export its configured Express.Router
const roomRouter = new RoomRouter();
roomRouter.init();

export default roomRouter.router;


