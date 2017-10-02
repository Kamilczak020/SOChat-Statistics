"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Api methods wrapper
function apiMethod(innerFunction) {
    return (req, res, next) => {
        Promise.resolve(innerFunction(req))
            .then(result => {
            console.log(result);
            res.json(result);
        }, (err) => {
            console.error(err.stack);
            res.status(err.status || 500);
            res.json(err);
        });
    };
}
exports.apiMethod = apiMethod;
