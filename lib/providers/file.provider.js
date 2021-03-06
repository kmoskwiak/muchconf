const fs = require('fs');
const Provider = require('../Provider');
const map = require('../utils/map');

class FileProvider extends Provider {
    constructor(configMap, options) {
        super();
        let defaultOptions = {
            fromEnv: false
        };
        this.setOptions({ ...defaultOptions, ...options });
        this.configMap = configMap;
        this.config = {};
    }

    async init() {
        return await this.readConfig();
    }

    readFile(filePath) {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, { encoding: 'utf8' }, (err, data) => {
                if(err) {
                    return reject(err);
                }
                return resolve(data);
            });
        }); 
    }

    async readConfig() {
        await map(this.config, this.configMap, async (filePath) => {
            let value = this.options.fromEnv ? await this.readFile(process.env[filePath]) : await this.readFile(filePath);
            value = this.parse(value);
            return value;
        });
    }

    load() {
        return Promise.resolve(this.config);
    }
}

/**
 * Configuration from files
 * @param {Object} configMap 
 * @param {Object} [options] common Provider options
 * @param {Boolean} [options.fromEnv=false] filepath is given by ENV variable
 * @param {Boolean} [options.castNumber=false] should strings be converted to number
 * @param {Boolean} [options.converTrueFalseString=false] should true/false strings be converted to boolean
 * @param {Boolean} [options.cutQuotations=false] should trim quotations form strings
 * @param {Boolean} [options.trim=true] trim whitespace from strings
 * @param {Object} [options.not] conditions to not use provider
 * @param {Object} [options.is] condtions to use provider
 */
function muchFile(configMap, options) {
    return new FileProvider(configMap, options);
}

module.exports = {
    FileProvider,
    muchFile
};