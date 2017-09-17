"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator = require("jsonschema");
const schema = {
    "id": "/AuthSchema",
    "type": "object",
    "properties": {
        "apikey": { "type": "string" }
    },
    "required": [
        "apikey"
    ]
};
function validateAuthConfig(json) {
    let result = Validator.validate(json, schema);
    return result.errors.length === 0;
}
exports.validateAuthConfig = validateAuthConfig;
