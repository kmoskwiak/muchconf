const muchconf = require('./lib/Muchconf');
const Provider = require('./lib/Provider');

const { muchArgv } = require('./lib/providers/argv.provider');
const { muchEnv } = require('./lib/providers/env.provider');
const { muchJsonFile } = require('./lib/providers/json-file.provider');
const { muchJson } = require('./lib/providers/json.provider');
const { muchFile } = require('./lib/providers/file.provider');

module.exports = {
    muchconf,
    Provider,

    muchArgv,
    muchEnv,
    muchJsonFile,
    muchJson,
    muchFile
};