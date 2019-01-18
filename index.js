const muchconf = require('./lib/Muchconf');
const Provider = require('./lib/Provider');
const ArgvProvider = require('./lib/providers/argv.provider');
const EnvProvider = require('./lib/providers/env.provider');
const JsonFileProvider = require('./lib/providers/json-file.provider');
const JsonProvider = require('./lib/providers/json.provider');
const wrapProvider = require('./lib/utils/providerWrapper');

module.exports = {
    muchconf,
    Provider,
    wrapProvider,

    ArgvProvider,
    EnvProvider,
    JsonFileProvider,
    JsonProvider, 

    muchArgv: wrapProvider(ArgvProvider),
    muchEnv: wrapProvider(EnvProvider),
    muchJsonFile: wrapProvider(JsonFileProvider),
    muchJson: wrapProvider(JsonProvider) 
};