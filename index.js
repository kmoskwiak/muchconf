const muchconf = require('./lib/Muchconf');
const Provider = require('./lib/Provider');
const ArgvProvider = require('./lib/providers/argv.provider');
const EnvProvider = require('./lib/providers/env.provider');
const JsonFileProvider = require('./lib/providers/json-file.provider');
const JsonProvider = require('./lib/providers/json.provider');

module.exports = {
    muchconf,
    Provider,
    ArgvProvider,
    EnvProvider,
    JsonFileProvider,
    JsonProvider 
};