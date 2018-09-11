const events = require('events');

class Store extends events.EventEmitter {
    constructor(providers) {
        super();
        this.config = {};
        this.providers = providers;

        this.configResolver = this.loadConfiguration();
    }

    async loadConfiguration() {
        for(let provider of this.providers) {
            this.config = Object.assign({}, this.config, await provider.load());
        }
        return this.config;
    }

    async load() {
        return this.configResolver();
    }

    async getConfig() {
        return this.configResolver;
    }
}

module.exports = Store;