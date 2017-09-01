import * as promise from 'bluebird';
import * as pgPromise from 'pg-promise';
import { Request, Response, NextFunction } from 'express';

// Init & connection options
const initOptions = {
    promiseLib: promise,
};

const connectionOptions = {
    host: 'localhost',
    port: 5432,
    database: 'sochat',
    user: 'postgres',
    password: 'Kaka1337#'
}

// Initialize pg-promise with bluebird
let pgp = pgPromise(initOptions);

// Create db connection with connection string
let db = pgp(connectionOptions);

export function getAllRooms(req: Request, res: Response, next: NextFunction) {
    db.any('select * from Rooms')
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
    db.one('select * from Rooms where room_id = $1', roomId)
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