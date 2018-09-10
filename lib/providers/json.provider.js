const Provider = require('../Provider');

class JSONprovider extends Provider {
    constructor(config) {
        super();
        this.config = config;
    }

    load() {
        Promise.resolve(this.config);
    }
}

module.exports = JSONprovider;