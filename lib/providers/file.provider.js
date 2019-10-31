const fs = require('fs');
const Provider = require('../Provider');
const map = require('../utils/map');

class FileProvider extends Provider {
    constructor(configMap, options) {
        super(options);
        this.configMap = configMap;
        this.config = {};
    }

    async init(currentconfig) {
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
            let value = await this.readFile(filePath);
            value = this.parse(value);
            return value;
        });
    }

    load() {
        return Promise.resolve(this.config);
    }
}

module.exports = FileProvider;