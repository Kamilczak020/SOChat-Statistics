import * as moment from 'moment';
import { Router, Request, Response, NextFunction } from 'express';
import { getAllRooms, postScrapeData } from '../queries/roomQueries';

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
        this.router.get('/:id/update', postScrapeData);
    }
}

// Create the RoomRouter, and export its configured Express.Router
const roomRouter = new RoomRouter();
roomRouter.init();

export default roomRouter.router;