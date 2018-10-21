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
        this.emittedEvents = {}; 
        this.configResolver = this.loadConfiguration();
    }

    merge(obj) {
        let config = Object.assign({}, this.config);
        for(let key in obj) {
            if(this.options.allowNullOrUndefined) {
                config[key] = obj[key];
            } else {
                if(typeof obj[key] === 'undefined' || obj[key] === null) {
                    config[key] = config[key];
                } else {
                    config[key] = obj[key];
                }
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
        this.emit('loaded');
    }

    /**
     * Load configuration
     * @returns Promise with configuration
     */
    async load() {
        try {
            await this.configResolver;
        } catch(err) {
            this.emit('error', err);
            throw err;
        }

        this.emitOnce('loaded');
        this.emitOnce('ready');
        return this.config;        
    }

    /**
     * Emits event only once
     * @param {String} eventName 
     */
    emitOnce(eventName) {
        if(!this.emittedEvents[eventName]) {
            this.emittedEvents[eventName] = true;
            this.emit(eventName);
        }
    }

    /**
     * Get configuration
     * @returns configuration
     */
    get() {
        return this.config;
    }

    /**
     * Get instance key (symbol)
     * @returns instance unique key
     */
    getSymbol() {
        return this.symbol;
    }

    /**
     * Listen for provider events
     * @param {Provider} provider 
     */
    watchProvider(provider) {
        provider.on('loaded', async () => {
            await this.loadConfiguration()
        });
    }
}

/**
 * Create or return instance of Muchconf
 * @param {Provider[]} provider 
 * @param {Object} options
 * @param {Symbol | String} options.instance
 * @param {Boolean} options.allowNullOrUndefined 
 * @returns Muchconf instace
 */
function muchconf(providers, options) {
    return new Muchconf(providers, options);
}

module.exports = muchconf;