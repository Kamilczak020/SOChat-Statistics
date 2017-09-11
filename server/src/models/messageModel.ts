import * as moment from 'moment';

export interface Message {
    message_id: number,
    user_id: number,
    username: string,
    response_id: number,
    room_id: number,
    body: string,
    timestamp: string,
    stars: number
}