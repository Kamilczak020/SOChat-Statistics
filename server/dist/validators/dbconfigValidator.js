"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator = require("jsonschema");
const schema = {
    "id": "/ConfigSchema",
    "type": "object",
    "properties": {
        "host": { "type": "string" },
        "port": { "type": "number" },
        "database": { "type": "string" },
        "user": { "type": "string" },
        "password": { "type": "string" },
    },
    "required": [
        "host",
        "port",
        "database",
        "user",
        "password"
    ]
};
function validateDbConfig(json) {
    let result = Validator.validate(json, schema);
    return result.errors.length === 0;
}
exports.validateDbConfig = validateDbConfig;
