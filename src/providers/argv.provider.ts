const map = require('../utils/map');
const parseArgv = require('../utils/parse-argv');

import Provider, { IProviderOptions } from '../Provider';

class ArgvProvider extends Provider {

    configMap: object = {};
    config: object = {};

    constructor(configMap, options) {
        super(options);
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

/**
 * Configuration from commandline arguments
 * @param {Object} configMap 
 * @param {Object} [options] common Provider options
 * @param {Boolean} [options.castNumber=true] should strings be converted to number
 * @param {Boolean} [options.converTrueFalseString=true] should true/false strings be converted to boolean
 * @param {Boolean} [options.cutQuotations=true] should trim quotations form strings
 * @param {Boolean} [options.trim=true] trim whitespace from strings
 * @param {Object} [options.not] conditions to not use provider
 * @param {Object} [options.is] condtions to use provider
 */
function muchArgv(configMap, options) {
    return new ArgvProvider(configMap, options);
}

module.exports = { 
    ArgvProvider,
    muchArgv
};