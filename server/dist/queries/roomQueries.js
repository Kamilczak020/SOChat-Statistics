"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbContext_1 = require("./dbContext");
function getAllRooms(req, res, next) {
    dbContext_1.database.any('SELECT * FROM rooms')
        .then((data) => {
        let roomCount = data.length;
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
exports.getAllRooms = getAllRooms;
function getRoomById(req, res, next) {
    let roomId = parseInt(req.params.id);
    dbContext_1.database.one('SELECT * FROM rooms WHERE room_id = $1', roomId)
        .then((data) => {
        res.status(200)
            .json({
            status: 'sucess',
            data: data,
            message: `Retrieved room of id: ${roomId}`
        });
    })
        .catch((err) => {
        return next(err);
    });
}
exports.getRoomById = getRoomById;
