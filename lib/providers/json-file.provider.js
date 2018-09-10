const Provider = require('../Provider');

class JSONfileProvider extends Provider {
    constructor(filePath, options) {
        super(options);
        this.filePath = filePath;
        this.config = {};
        this.readFile();
    }

    readFile() {
        this.config = require(this.filePath);
    }

    load() {
        return Promise.resolve(this.config);
    }
}

module.exports = JSONfileProvider;