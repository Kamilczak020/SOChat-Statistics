import * as request from 'request';
import * as cheerio from 'cheerio';
import * as moment from 'moment';

const transcriptBaseUrl = 'https://chat.stackoverflow.com/transcript';

export function scrapeTranscriptPage(roomId: number, date: moment.Moment) {
    let url = `${transcriptBaseUrl}/${roomId}/${date.year}/${date.month}/${date.day}/0-24`;

    request(url, (error, response, body) => {
        if (!error) {
            let $ = cheerio.load(body);
            let messageElement = $('div.message');

            messageElement.each((index, element) => {
                let message = element.children.find('')
            })
        }
    })
}