import Provider, { IProviderOptions } from '../Provider';
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
    }

    async init() {
        await this.readEnv();
    }

    async readEnv() {
        await map(this.config, this.configMap, (envName) => {
            let value = this.parse(process.env[envName]);
            return value;
        });
    }

    load() {
        return Promise.resolve(this.config);
    }
}

/**
 * Configuration from ENV variables
 * @param {Object} configMap mapping between configuration keys and ENV variables
 * @param {Object} [options] common Provider options
 * @param {Boolean} [options.castNumber=true] should strings be converted to number
 * @param {Boolean} [options.converTrueFalseString=true] should true/false strings be converted to boolean
 * @param {Boolean} [options.cutQuotations=false] should trim quotations form strings
 * @param {Boolean} [options.trim=true] trim whitespace from strings
 * @param {Object} [options.not] conditions to not use provider
 * @param {Object} [options.is] condtions to use provider
 */
function muchEnv(configMap, options) {
    return new EnvProvider(configMap, options);
}

module.exports = {
    EnvProvider,
    muchEnv
};