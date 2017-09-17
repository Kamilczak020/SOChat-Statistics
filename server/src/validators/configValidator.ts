import * as Validator from 'jsonschema';
import * as glob from 'glob';
import * as path from 'path';

// Set this corresponding to your paths (relative to the project root)
const pathToConfigs = './configs';
const pathToSchemas = './dist/validators/schemas';

const rootRelativePath = '../../';

export async function validateConfigs(callback: (res) => void) {
    const result = await getConfigValidity();
    callback(result);
}

async function getConfigValidity() {
    // Find all available configs' and schemas' filenames
    const configNames = await getFilenames(pathToConfigs);
    const schemaNames = await getFilenames(pathToSchemas);

    return await configNames.map((configName) => {
        const expectedSchemaName = getExpectedSchemaFilename(configName);
        const schemaIndex = schemaNames.indexOf(expectedSchemaName);

        if (schemaIndex !== undefined) {
            // Import configs & schemas and check validity
            const config = require(path.join(rootRelativePath, pathToConfigs + '/' + configName));
            const schema = require(path.join(rootRelativePath, pathToSchemas + '/' + schemaNames[schemaIndex]));
            const result = validate(config, schema);
            if (!result) {
                console.log(configName + ' does not match the schema');
            } 
            return result;
        }
        console.log('Schema for ' + configName + ' was not found. Assuming correct');
        return true;
    })
    .reduce((stack, current) => stack && current);
}

async function getFilenames(cwd: string) {
    return new Promise<string[]>((resolve, reject) => {
        glob('*.json', {cwd: cwd}, (err, filenames) => {
            if (err) {
                return reject(err);
            }   
            const lcFilenames = filenames.map((filename) => {
                return filename.toLowerCase();
            })
            return resolve(lcFilenames);
        })
    })
}

function getExpectedSchemaFilename(filename: string) {
    const lcase = filename.toLowerCase();
    return lcase.substr(0, lcase.length - 5) + 'schema' + lcase.substr(lcase.length - 5);
}

function validate(json: JSON, schema: JSON): boolean {
    const res = Validator.validate(json, schema);
    return res.errors.length === 0;
}