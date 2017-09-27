import * as moment from 'moment';
import { Router, Request, Response, NextFunction } from 'express';
import { postFromScrapeData } from '../queries/updateQueries';
import { apiMethod } from './apiMethod';

/**
 * Router used for '/update' route, providing access
 * to updating the database from the transcript scrape.
 */
export class UpdateRouter {
    router: Router
  
    constructor() {
      this.router = Router();
      this.init();
    }

    // Define routing behavior and attach db queries
    init() {
        this.router.post('/rooms/:roomid', apiMethod(postFromScrapeData));
    }
}

// Create the UpdateRouter, and export its configured Express.Router
const updateRouter = new UpdateRouter();
updateRouter.init();

export default updateRouter.router;