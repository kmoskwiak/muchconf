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

module.exports = JSONprovider;