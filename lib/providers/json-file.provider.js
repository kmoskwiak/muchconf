const Provider = require('../Provider');

class JSONfileProvider extends Provider {
    constructor(filePath) {
        super();
        this.filePath = filePath;
        this.config = {};
        this.readFile();
    }

    readFile() {
        this.config = require(this.filePath);
    }

    load() {
        Promise.resolve(this.config);
    }
}

module.exports = JSONfileProvider;