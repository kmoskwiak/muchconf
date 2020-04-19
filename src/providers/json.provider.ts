import Provider, { IProviderOptions } from '../Provider';

class JSONprovider extends Provider {

    configuration: object = {};

    constructor(configuration: object, options: IProviderOptions) {
        super(options);
        this.configuration = configuration;
    }

    load() {
        return Promise.resolve(this.configuration);
    }
}

/**
 * Configuration from JSON
 * @param {object}  configuration object with configuration
 * @param {object}  [options] common Provider options
 * @param {boolean} [options.castNumber=false] should strings be converted to number
 * @param {boolean} [options.converTrueFalseString=false] should true/false strings be converted to boolean
 * @param {boolean} [options.cutQuotations=false] should trim quotations form strings
 * @param {boolean} [options.trim=true] trim whitespace from strings
 * @param {object}  [options.not] conditions to not use provider
 * @param {object}  [options.is] condtions to use provider
 */
function muchJson(configuration: object, options: IProviderOptions) {
    return new JSONprovider(configuration, options);
}

module.exports = {
    JSONprovider,
    muchJson
};