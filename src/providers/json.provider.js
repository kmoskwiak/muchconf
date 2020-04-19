const Provider = require('../Provider');

class JSONprovider extends Provider {
    constructor(config, options) {
        super(options);
        this.config = config;
    }

    load() {
        return Promise.resolve(this.config);
    }
}

/**
 * Configuration from JSON
 * @param {object} config object with configuration
 * @param {Object} [options] common Provider options
 * @param {Boolean} [options.castNumber=false] should strings be converted to number
 * @param {Boolean} [options.converTrueFalseString=false] should true/false strings be converted to boolean
 * @param {Boolean} [options.cutQuotations=false] should trim quotations form strings
 * @param {Boolean} [options.trim=true] trim whitespace from strings
 * @param {Object} [options.not] conditions to not use provider
 * @param {Object} [options.is] condtions to use provider
 */
function muchJson(config, options) {
    return new JSONprovider(config, options);
}

module.exports = {
    JSONprovider,
    muchJson
};