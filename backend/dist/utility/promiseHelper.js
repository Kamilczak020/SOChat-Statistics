"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// A wrapper method for promises, that allows for error handling without try/catch
function to(promise) {
    return promise.then(data => {
        return [null, data];
    })
        .catch(err => [err]);
}
exports.to = to;
