import * as moment from 'moment';
import { Router, Request, Response, NextFunction } from 'express';
import { getAllRooms, postScrapeData } from '../queries/roomQueries';
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
        this.router.get('/', passport.authenticate('localapikey', {session: false}), getAllRooms);
        this.router.get('/:id/update', postScrapeData);
        this.router.get('/test', passport.authenticate('localapikey', {session: false}), (req, res) => {
            res.json({
                message: 'nonce'
            })
        })
    }
}

// Create the RoomRouter, and export its configured Express.Router
const roomRouter = new RoomRouter();
roomRouter.init();

export default roomRouter.router;