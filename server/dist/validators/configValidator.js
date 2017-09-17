"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Validator = require("jsonschema");
const glob = require("glob");
const path = require("path");
// Set this corresponding to your paths (relative to the project root)
const pathToConfigs = './configs';
const pathToSchemas = './dist/validators/schemas';
const rootRelativePath = '../../';
function validateConfigs(callback) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield getConfigValidity();
        callback(result);
    });
}
exports.validateConfigs = validateConfigs;
function getConfigValidity() {
    return __awaiter(this, void 0, void 0, function* () {
        // Find all available configs' and schemas' filenames
        const configNames = yield getFilenames(pathToConfigs);
        const schemaNames = yield getFilenames(pathToSchemas);
        return yield configNames.map((configName) => {
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
    });
}
function getFilenames(cwd) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            glob('*.json', { cwd: cwd }, (err, filenames) => {
                if (err) {
                    return reject(err);
                }
                const lcFilenames = filenames.map((filename) => {
                    return filename.toLowerCase();
                });
                return resolve(lcFilenames);
            });
        });
    });
}
function getExpectedSchemaFilename(filename) {
    const lcase = filename.toLowerCase();
    return lcase.substr(0, lcase.length - 5) + 'schema' + lcase.substr(lcase.length - 5);
}
function validate(json, schema) {
    const res = Validator.validate(json, schema);
    return res.errors.length === 0;
}
