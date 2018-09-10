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
        this.readArgv(process.argv);
    }

    readArgv(argv) {
        let argvConfig = parseArgv(argv);
        map(this.config, this.configMap, (argName) => {
            let value = this.parse(argvConfig[argName]);
            return value;
        });
    }

    load() {
        return Promise.resolve(this.config);
    }
}

module.exports = ArgvProvider;