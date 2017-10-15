import * as promise from 'bluebird';
import * as pgPromise from 'pg-promise';
import * as moment from 'moment';
import { to } from '../utility/promiseHelper';
import { Request } from 'express';
import { database as db, pgpromise as pgp} from './dbContext';
import { NotFoundError, DatabaseError } from '../errors/routerErrors';

export async function getAllRooms(req: Request) {
    const [err, data] = await to(db.any('SELECT * FROM rooms'));
    
    if (err) {
        throw new DatabaseError(err);
    }
    
    if (data.length === 0) {
        throw new NotFoundError('No stored rooms were found');
    } 

    return {
        status: 'sucess',
        data: data,
        message: `Retrieved ${data.length} rooms.`
    };
}