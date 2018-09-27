const events = require('events');
let mainInstanceSymbol = null;
const instances = {};

class Store extends events.EventEmitter {
    constructor(providers, instance) {
        if(!instance && mainInstanceSymbol) { return instances[mainInstanceSymbol]; }
        if(!instance && instances[instance]) { return instances[instance]; }
        
        super();

        if(!instance) {
            mainInstanceSymbol = this.symbol = Symbol('main_instance');
            instances[mainInstanceSymbol] = this;
        } else {
            this.symbol = instance;
            instances[instance] = this;
        }

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
            await this.configResolver;
        } catch(err) {
            this.emit('error');
            throw err;
        }
    
        this.emit('loaded');
        return this.config;
    }

    get() {
        return config;
    }

    getSymbol() {
        return this.symbol;
    }
}

module.exports = Store;