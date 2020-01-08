const Provider = require('../Provider');

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

module.exports = JSONfileProvider;