const muchconf = require('./Muchconf');
import Provider from './Provider';

const { muchArgv } = require('./providers/argv.provider');
const { muchEnv } = require('./providers/env.provider');
const { muchJsonFile } = require('./providers/json-file.provider');
const { muchJson } = require('./providers/json.provider');
const { muchFile } = require('./providers/file.provider');

module.exports = {
    muchconf,
    Provider,

    muchArgv,
    muchEnv,
    muchJsonFile,
    muchJson,
    muchFile
};