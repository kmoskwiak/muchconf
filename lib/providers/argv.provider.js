const Provider = require('../Provider');
const map = require('../utils/map');
const parseArgv = require('../utils/parse-argv');

class ArgvProvider extends Provider {
    constructor(configMap, options) {
        super();
        let defaultOptions = {
            converTrueFalseStrings: true,
            castNumbers: true,
            cutQuotations: true
        };
        this.setOptions({ ...defaultOptions, ...options });
        this.configMap = configMap;
        this.config = {};
    }

    async init() {
        await this.readArgv(process.argv);
    }

    async readArgv(argv) {
        let argvConfig = parseArgv(argv);
        await map(this.config, this.configMap, (argName) => {
            let value = this.parse(argvConfig[argName]);
            return value;
        });
    }

    load() {
        return Promise.resolve(this.config);
    }
}

module.exports = ArgvProvider;