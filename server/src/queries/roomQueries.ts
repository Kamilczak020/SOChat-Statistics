import * as promise from 'bluebird';
import * as pgPromise from 'pg-promise';
import * as moment from 'moment';
import { Request, Response, NextFunction } from 'express';
import { scrapeTranscriptPage } from '../scrapers/transcriptScraper';
import { database as db, pgpromise as pgp} from './dbContext';

export function getAllRooms(req: Request, res: Response, next: NextFunction) {
    db.any('SELECT * FROM rooms')
        .then((data) => {
            let roomCount: number = data.length;
            res.status(200)
                .json({
                    status: 'sucess',
                    data: data,
                    message: `Retrieved ${roomCount} rooms.`
                });
        })
        .catch((err) => {
            return next(err);
        });
}

export function getRoomById(req: Request, res: Response, next: NextFunction) {
    let roomId = parseInt(req.params.id);
    db.one('SELECT * FROM rooms WHERE room_id = $1', roomId)
        .then((data) => {
            res.status(200)
                .json({
                    status: 'sucess',
                    data: data,
                    message: `Retrieved room of id: ${roomId}`
                })
        })
        .catch((err) => {
            return next(err);
        })
}