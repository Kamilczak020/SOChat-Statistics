import * as moment from 'moment';
import { Router, Request, Response, NextFunction } from 'express';
import { getAllRooms } from '../queries/roomQueries';
import { passport } from '../authentication/passport';

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
        this.router.get('/', getAllRooms);
    }
}

// Create the RoomRouter, and export its configured Express.Router
const roomRouter = new RoomRouter();
roomRouter.init();

export default roomRouter.router;