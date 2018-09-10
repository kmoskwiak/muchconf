const events = require('events');

class Store extends events.EventEmitter {
    constructor(providers) {
        super();
        this.config = {};
        this.providers = providers;

        this.loadConfiguration();
    }

    async loadConfiguration() {
        for(let provider of this.providers) {
            this.config = Object.assign({}, this.config, await provider.load());
        }
    }

    getConfig() {
        return this.config;
    }
}

module.exports = Store;