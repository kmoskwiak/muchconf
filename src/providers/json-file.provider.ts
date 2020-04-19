import Provider, { IProviderOptions } from '../Provider';

class JSONfileProvider extends Provider {

    filePath: string | Function = '';
    config: object = {};

    constructor(filePath: string | Function, options: IProviderOptions) {
        super(options);
        this.filePath = filePath;
    }

    init(currentconfig: object) {
        const filePath = this.setOption(this.filePath, currentconfig);
        return Promise.resolve(this.readFile(filePath));
    }

    readFile(filePath: string) {
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
function muchJsonFile(filePath: string | Function, options: IProviderOptions) {
    return new JSONfileProvider(filePath, options);
}

module.exports = {
    JSONfileProvider,
    muchJsonFile
};