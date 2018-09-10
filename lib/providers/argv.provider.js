const Provider = require('../Provider');
const map = require('../utils/map');

class ArgvProvider extends Provider {
    constructor(configMap, options) {
        super(options);
        this.configMap = configMap;
        this.config = {};
    }

    readArgs() {
        map(this.config, this.configMap, (argName) => {
            let value = this.parse(process.argv[argName]);
            return value;
        });
    }

    load() {
        return Promise.resolve(this.config);
    }
}

module.exports = ArgvProvider;