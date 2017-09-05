import * as moment from 'moment';

export interface Message {
    message_id: number,
    user_id: number,
    response_message_id: number,
    room_id: number,
    text: string,
    datetime: string,
    stars: number
}