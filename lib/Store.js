const events = require('events');
const storeInstance = null;

class Store extends events.EventEmitter {
    constructor(providers) {
        if(storeInstance) { return storeInstance; }
        super();
        storeInstance = this;
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
        try {
            await this.configResolver();
        } catch(err) {
            this.emit('error');
            throw err;
        }
    
        config = this.config;
        this.emit('loaded');
        return config;
    }

    get() {
        return config;
    }
}

module.exports = Store;