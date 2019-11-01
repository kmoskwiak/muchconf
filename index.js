const muchconf = require('./lib/Muchconf');
const Provider = require('./lib/Provider');
const ArgvProvider = require('./lib/providers/argv.provider');
const EnvProvider = require('./lib/providers/env.provider');
const JsonFileProvider = require('./lib/providers/json-file.provider');
const JsonProvider = require('./lib/providers/json.provider');
const FileProvider = require('./lib/providers/file.provider');
const wrap = require('./lib/utils/providerWrapper');

module.exports = {
    muchconf,
    Provider,
    wrap,

    ArgvProvider,
    EnvProvider,
    JsonFileProvider,
    JsonProvider, 
    FileProvider,

    muchArgv: wrap(ArgvProvider),
    muchEnv: wrap(EnvProvider),
    muchJsonFile: wrap(JsonFileProvider),
    muchJson: wrap(JsonProvider),
    muchFile: wrap(FileProvider)
};