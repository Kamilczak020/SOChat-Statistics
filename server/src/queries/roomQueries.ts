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

export function postScrapeData(req: Request, res: Response, next: NextFunction) {
    const roomId = parseInt(req.params.id);
    const date = moment('2017/08/31', 'YYYY/MM/DD');
    scrapeTranscriptPage(roomId, date, (scrapeError, scrapeData) => {
        if (scrapeError) {
            console.log(scrapeError);
            throw new scrapeError;
        }

        // Insert users into the db, omit copies
        db.tx(t => {
            let queries = [];
            scrapeData.forEach((element) => {
                const query = t.none('INSERT INTO users(user_id, name) VALUES ($1, $2) ' +
                    'ON CONFLICT (user_id) DO NOTHING', [element.user_id, element.username]);
                queries.push(query);
            })
            return t.batch(queries);
        })
        .catch((err) => {
            console.log(err);
        })

        db.tx(t => {
            let queries = [];
            scrapeData.forEach((element) => {
                const query = t.none('INSERT INTO rooms(room_id) VALUES ($1) ' +
                    'ON CONFLICT (room_id) DO NOTHING', [element.room_id]);
                queries.push(query);
            })
            return t.batch(queries);
        })
        .catch((err) => {
            console.log(err);
        })
    })
}
