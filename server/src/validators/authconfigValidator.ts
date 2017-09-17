import * as Validator from 'jsonschema';

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

export function validateAuthConfig(json: JSON): boolean {
    let result = Validator.validate(json, schema);
    return result.errors.length === 0;
}