const Provider = require('../Provider');
const map = require('../utils/map');

class EnvProvider extends Provider {
    constructor(configMap, options) {
        super();
        let defaultOptions = {
            converTrueFalseStrings: true,
            castNumbers: true
        };
        this.setOptions({ ...defaultOptions, ...options });
        this.configMap = configMap;
        this.config = {};
        this.readEnv();
    }

    readEnv() {
        map(this.config, this.configMap, (envName) => {
            let value = this.parse(process.env[envName]);
            return value;
        });
    }

    load() {
        return Promise.resolve(this.config);
    }
}

module.exports = EnvProvider;