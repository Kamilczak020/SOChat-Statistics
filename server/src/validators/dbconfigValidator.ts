import * as Validator from 'jsonschema';

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

export function validateDbConfig(json: JSON): boolean {
    let result = Validator.validate(json, schema);
    return result.errors.length === 0;
}