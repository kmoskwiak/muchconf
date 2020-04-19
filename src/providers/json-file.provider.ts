import Provider, { IProviderOptions } from '../Provider';

class JSONfileProvider extends Provider {
    constructor(filePath, options) {
        super(options);
        this.filePath = filePath;
        this.config = {};
    }

    init(currentconfig) {
        const filePath = this.setOption(this.filePath, currentconfig);
        return this.readFile(filePath);
    }

    readFile(filePath) {
        if(!filePath) { return; }
        this.config = require(filePath);
    }

    load() {
        return Promise.resolve(this.config);
    }
}

/**
 * Configuration from JS or JSON file
 * @param {String} filePath 
 * @param {Object} [options] common Provider options
 * @param {Boolean} [options.castNumber=false] should strings be converted to number
 * @param {Boolean} [options.converTrueFalseString=false] should true/false strings be converted to boolean
 * @param {Boolean} [options.cutQuotations=false] should trim quotations form strings
 * @param {Boolean} [options.trim=true] trim whitespace from strings
 * @param {Object} [options.not] conditions to not use provider
 * @param {Object} [options.is] condtions to use provider
 */
function muchJsonFile(filePath, options) {
    return new JSONfileProvider(filePath, options);
}

module.exports = {
    JSONfileProvider,
    muchJsonFile
};