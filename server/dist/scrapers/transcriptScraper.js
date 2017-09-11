"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const cheerio = require("cheerio");
const transcriptBaseUrl = 'https://chat.stackoverflow.com/transcript';
/**
 *
 * @param roomId Id of the room to scrape
 * @param date Date of the transcript page to scrape. Only takes into account Day, Month and Year
 * @param callback The callback
 */
function scrapeTranscriptPage(roomId, date, callback) {
    const timestamp = date.format('YYYY-MM-DD');
    const year = date.format('YYYY');
    const month = date.format('MM');
    const day = date.format('DD');
    let messages = [];
    const url = `${transcriptBaseUrl}/${roomId}/${year}/${month}/${day}/0-24`;
    request(url, (err, res, body) => {
        if (err) {
            callback(err, null);
        }
        else {
            const $ = cheerio.load(body);
            const monologueElements = $('div.monologue');
            // Each monologue block is a group of messages by one user. It contains user info and message objects.
            monologueElements.each((monologueIndex, monologueElement) => {
                const userId = getUserId(monologueElement, $);
                const username = $(monologueElement).find('div.username').children('a').attr('title');
                const messageElements = $(monologueElement).find('div.message');
                // Each single message contains *only* message-specific information.
                messageElements.each((messageIndex, messageElement) => {
                    const messageId = getMessageId(messageElement, $);
                    const messageText = getMessageText(messageElement, $);
                    const stars = getStars(messageElement, $);
                    // Optional parameters (not all messages are responses)
                    const responseMessageId = getResponseId(messageElement, $);
                    // If message text is not undefined (meaning that it is not a oneboxed message), push it to model
                    if (messageText !== undefined) {
                        const message = { message_id: messageId,
                            user_id: userId,
                            username: username,
                            response_id: responseMessageId,
                            room_id: roomId,
                            body: messageText,
                            timestamp: timestamp,
                            stars: stars };
                        messages.push(message);
                    }
                });
            });
            // Fire a callback with results
            callback(null, messages);
        }
    });
}
exports.scrapeTranscriptPage = scrapeTranscriptPage;
// Extracts user id from classname
function getUserId(monologueElement, $) {
    const userIdClass = $(monologueElement).attr('class');
    const userId = userIdClass.split('-')[1];
    return parseInt(userId);
}
// Extracts message id from classname
function getMessageId(messageElement, $) {
    const messageIdClass = $(messageElement).attr('id');
    const messageId = messageIdClass.split('-')[1];
    return parseInt(messageId);
}
// Extracts message text from the content div.
function getMessageText(messageElement, $) {
    const content = $(messageElement).children('div.content');
    // In case of onebox messages, return undefined.
    if ($(content).children().is('div.onebox')) {
        return undefined;
    }
    else {
        return content.contents().text();
    }
}
// Extracts response id from classname. Messages that arent a response, stay null.
function getResponseId(messageElement, $) {
    if ($(messageElement).children().is('a.reply-info')) {
        const responseIdClass = $(messageElement).children('a.reply-info').attr('href');
        const responseId = responseIdClass.split('#')[1];
        return parseInt(responseId);
    }
    else {
        return null;
    }
}
// Extracts stars count from classname. For messages without stars returns 0.
function getStars(messageElement, $) {
    if ($(messageElement).children('span.flash').children().is('span.stars')) {
        const starsElement = $(messageElement).find('span.stars').children('span.times');
        const stars = starsElement.first().text();
        return stars === '' ? 1 : parseInt(stars);
    }
    else {
        return 0;
    }
}
