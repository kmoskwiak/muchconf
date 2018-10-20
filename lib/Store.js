const events = require('events');
let mainInstanceSymbol = null;
const instances = {};

class Muchconf extends events.EventEmitter {
    constructor(providers = [], options = {}) {
        let instance = options.instance;
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

        this.options = options;
        this.config = {};
        this.rawConfig = [];
        this.providers = providers;        
        this.configResolver = this.loadConfiguration();
    }

    merge(obj) {
        let config = Object.assign({}, this.config);
        for(let key in obj) {
            if(this.options.allowFalsy) {
                config[key] = obj[key];
            } else {
                config[key] = obj[key] || config[key];
            }
        }
        return config;
    }

    async loadConfiguration() {
        for(let i in this.providers) {
            let provider = this.providers[i];
            let providerConfig = await provider.loadConfiguration(this.config);
            this.rawConfig.push(providerConfig)

            if(provider.watching()) {
                provider.on('update', () => {
                    this.updateConfiguration(i);
                });
            }

            //this.config = Object.assign({}, this.config, providerConfig);

            this.config = this.merge(providerConfig);
        }
        return this.config;
    }

    async updateConfiguration(index) {
        let tempConfig = {};
        for(let i in this.rawConfig) {
            if(i === index) {
                this.rawConfig[i] = await this.providers[i].loadConfiguration(tempConfig);
            }
            tempConfig = Object.assign({}, tempConfig, this.rawConfig[i]);
        }

        this.config = Object.assign({}, tempConfig);        
        this.emit('update');
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
        return this.config;
    }

    getSymbol() {
        return this.symbol;
    }

    watchProvider(provider) {
        provider.on('loaded', async () => {
            await this.loadConfiguration()
        });
    }
}


module.exports = function(providers, options) {
    return new Muchconf(providers, options);
};